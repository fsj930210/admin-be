import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BusinessException } from '../exceptions/business.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const requset = ctx.getRequest<Request>();
    const status = exception.getStatus();
    if (exception instanceof BusinessException) {
      const error = exception.getResponse();
      response.status(HttpStatus.OK).send({
        data: null,
        code: (error as any)['code'],
        message: (error as any)['message'],
      });
      return;
    }
    response.status(status).json({
      code: status,
      path: requset.url,
      method: requset.method,
      message: exception.message,
      timestamp: new Date().toISOString(),
      data: null,
    });
  }
}
