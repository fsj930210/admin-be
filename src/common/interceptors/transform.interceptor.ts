import { CallHandler, NestInterceptor, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { NOT_TRANSFORM_METADATA } from '../constants';

interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const keep = this.reflector.get<boolean>(NOT_TRANSFORM_METADATA, context.getHandler());
        if (keep) {
          return data;
        } else {
          return {
            data,
            code: 0,
            message: 'success',
          };
        }
      }),
    );
  }
}
