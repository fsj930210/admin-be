import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
  InternalServerErrorException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import * as requestIp from 'request-ip';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerService,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { httpAdapter } = this.httpAdapterHost;
    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = (new InternalServerErrorException().getResponse() as any).message;
    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      message,
    };
    this.logger.error('all exception', exception);
    this.logger.error('[admin-be]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
