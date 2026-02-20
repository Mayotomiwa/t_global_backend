import { ResponseInterceptor } from './response.interceptors';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseInterceptor (Unit)', () => {
  let interceptor: ResponseInterceptor<any>;

  function buildContext(statusCode = 200): jest.Mocked<ExecutionContext> {
    const mockHttpHost = {
      getResponse: jest.fn().mockReturnValue({ statusCode }),
      getRequest: jest.fn(),
      getNext: jest.fn(),
    };
    return {
      switchToHttp: jest.fn().mockReturnValue(mockHttpHost),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as jest.Mocked<ExecutionContext>;
  }

  function buildHandler(data: unknown): jest.Mocked<CallHandler> {
    return { handle: jest.fn().mockReturnValue(of(data)) } as jest.Mocked<CallHandler>;
  }

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // Response shape
  // ---------------------------------------------------------------------------
  it('wraps the payload in the standard ApiResponse envelope', (done) => {
    interceptor.intercept(buildContext(200), buildHandler({ id: '1' })).subscribe({
      next: (result) => {
        expect(result).toEqual({ success: true, statusCode: 200, data: { id: '1' } });
        done();
      },
      error: done.fail,
    });
  });

  it('forwards the exact data returned by the route handler', (done) => {
    const payload = [{ id: 'a' }, { id: 'b' }];
    interceptor.intercept(buildContext(200), buildHandler(payload)).subscribe({
      next: (result) => {
        expect(result.data).toEqual(payload);
        done();
      },
      error: done.fail,
    });
  });

  it('always sets success: true in a successful response', (done) => {
    interceptor.intercept(buildContext(201), buildHandler({})).subscribe({
      next: (result) => {
        expect(result.success).toBe(true);
        done();
      },
      error: done.fail,
    });
  });

  // ---------------------------------------------------------------------------
  // Status code propagation
  // ---------------------------------------------------------------------------
  it('uses the HTTP status code from the response object (201)', (done) => {
    interceptor.intercept(buildContext(201), buildHandler(null)).subscribe({
      next: (result) => {
        expect(result.statusCode).toBe(201);
        done();
      },
      error: done.fail,
    });
  });

  it('uses the HTTP status code from the response object (200)', (done) => {
    interceptor.intercept(buildContext(200), buildHandler('ok')).subscribe({
      next: (result) => {
        expect(result.statusCode).toBe(200);
        done();
      },
      error: done.fail,
    });
  });

  // ---------------------------------------------------------------------------
  // Edge-case data values
  // ---------------------------------------------------------------------------
  it('handles a null data payload without throwing', (done) => {
    interceptor.intercept(buildContext(200), buildHandler(null)).subscribe({
      next: (result) => {
        expect(result.data).toBeNull();
        done();
      },
      error: done.fail,
    });
  });

  it('handles an undefined data payload', (done) => {
    interceptor.intercept(buildContext(200), buildHandler(undefined)).subscribe({
      next: (result) => {
        expect(result.data).toBeUndefined();
        done();
      },
      error: done.fail,
    });
  });

  it('handles a string payload', (done) => {
    interceptor.intercept(buildContext(200), buildHandler('hello')).subscribe({
      next: (result) => {
        expect(result.data).toBe('hello');
        done();
      },
      error: done.fail,
    });
  });
});
