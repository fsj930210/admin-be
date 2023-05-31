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
    const status = exception.getStatus();
    // 处理业务逻辑，返回业务统一格式
    if (exception instanceof BusinessException) {
      const message = exception.getResponse();
      console.log(message);
      const code = exception.getErrorCode();
      response
        .status(HttpStatus.OK)
        .json(new BasicResponseDto(code, null, message as string));
      return;
    }
    // 其他如404等 返回更详细信息
    response.status(status).json({
      code: status,
      path: requset.url,
      method: requset.method,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
