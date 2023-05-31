import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import * as requestIp from 'request-ip';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { httpAdapter } = this.httpAdapterHost;
    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    console.log(exception);
    // exception 应该记录日志，而不是反馈给用户
    const message = (new InternalServerErrorException().getResponse() as any)
      .message;
    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      message,
    };
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
