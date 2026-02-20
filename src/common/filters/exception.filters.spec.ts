import { TransformException } from './exception.filters';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

describe('TransformException (Unit)', () => {
  let filter: TransformException;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockRequest: { url: string; method: string };
  let mockHttpHost: jest.Mocked<HttpArgumentsHost>;
  let mockHost: jest.Mocked<ArgumentsHost>;

  beforeEach(() => {
    filter = new TransformException();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = { url: '/test', method: 'GET' };

    mockHttpHost = {
      getResponse: jest.fn().mockReturnValue(mockResponse),
      getRequest: jest.fn().mockReturnValue(mockRequest),
      getNext: jest.fn(),
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpHost),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // HttpException variants
  // ---------------------------------------------------------------------------
  it('handles an HttpException with a plain string response', () => {
    filter.catch(new HttpException('Not Found', HttpStatus.NOT_FOUND), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not Found',
      statusCode: '404',
      data: null,
    });
  });

  it('handles an HttpException with a structured object response', () => {
    const body = { message: 'Validation failed', data: { field: 'email' } };
    filter.catch(new HttpException(body, HttpStatus.BAD_REQUEST), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      statusCode: '400',
      data: { field: 'email' },
    });
  });

  it('handles a NestJS validation-pipe array message (from BadRequestException)', () => {
    const body = { message: ['title must not be empty', 'date must be a date string'], error: 'Bad Request' };
    filter.catch(new HttpException(body, HttpStatus.BAD_REQUEST), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: '400',
        message: ['title must not be empty', 'date must be a date string'],
      }),
    );
  });

  it('handles a 404 NotFoundException', () => {
    const body = { message: 'Publication abc not found', error: 'Not Found' };
    filter.catch(new HttpException(body, HttpStatus.NOT_FOUND), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, statusCode: '404' }),
    );
  });

  it('handles a 500 InternalServerErrorException', () => {
    filter.catch(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, statusCode: '500' }),
    );
  });

  // ---------------------------------------------------------------------------
  // Generic Error (non-Http)
  // ---------------------------------------------------------------------------
  it('handles a generic Error with the error message', () => {
    filter.catch(new Error('Database connection lost'), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Database connection lost',
      statusCode: '500',
      data: null,
    });
  });

  it('falls back to the default message for non-Error unknowns', () => {
    filter.catch({ someRandomField: 42 }, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong, Please try again later.',
      statusCode: '500',
      data: null,
    });
  });

  it('falls back to the default message when the unknown is null', () => {
    filter.catch(null, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Something went wrong, Please try again later.' }),
    );
  });

  // ---------------------------------------------------------------------------
  // Response shape contract
  // ---------------------------------------------------------------------------
  it('always sets success: false in the error response', () => {
    filter.catch(new HttpException('Forbidden', HttpStatus.FORBIDDEN), mockHost);

    const jsonArg = mockResponse.json.mock.calls[0][0];
    expect(jsonArg.success).toBe(false);
  });

  it('serialises statusCode as a string, not a number', () => {
    filter.catch(new HttpException('Conflict', HttpStatus.CONFLICT), mockHost);

    const jsonArg = mockResponse.json.mock.calls[0][0];
    expect(typeof jsonArg.statusCode).toBe('string');
    expect(jsonArg.statusCode).toBe('409');
  });
});
