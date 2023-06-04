import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { BasicResponseDto } from '../dto/response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const requset = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionRes = exception.getResponse();
    const code =
      exception instanceof BusinessException
        ? (exception as BusinessException).getErrorCode()
        : status;
    console.log('status', status, 'code', code);

    let message = exception?.message || '系统内部异常';
    const exceptionMsg = (exceptionRes as any)?.message;
    if (typeof exceptionMsg === 'string') {
      // pipe验证错误
      message = exceptionMsg;
    } else if (Array.isArray(exceptionMsg)) {
      // dto验证错误
      message = exceptionMsg.join('、');
    }
    response.status(status).json(new BasicResponseDto(code, null, message));
  }
}
