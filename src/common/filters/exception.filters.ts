import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class TransformException implements ExceptionFilter {
  private readonly logger = new Logger(TransformException.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Default response
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong, Please try again later.';
    let statusCode = '500';
    let errorData: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle structured or simple responses
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, any>;
        message = res.message || message;
        errorData = res.data || null;
      }

      statusCode = status.toString();
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(
      `${request.method} ${request.url} — ${status}: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      success: false,
      message,
      statusCode,
      data: errorData,
    });
  }
}
