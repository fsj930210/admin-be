import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as requestIp from 'request-ip';
import { BusinessException } from '../exceptions/business.exception';
import { BasicResponseDto } from '../dto/response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionRes = exception.getResponse();
    const code =
      exception instanceof BusinessException
        ? (exception as BusinessException).getErrorCode()
        : `${status}`;

    let message = exception?.message || '系统内部异常';
    const exceptionMsg = (exceptionRes as any)?.message;
    if (typeof exceptionMsg === 'string') {
      // pipe验证错误
      message = exceptionMsg;
    } else if (Array.isArray(exceptionMsg)) {
      // dto验证错误
      message = exceptionMsg.join('、');
    }
    const responseBody = {
      url: request.url,
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      message,
      status,
    };
    this.logger.error('http exception', exception);
    this.logger.error('[admin-be]', responseBody);
    response.status(status).json(new BasicResponseDto(code, null, message));
  }
}
