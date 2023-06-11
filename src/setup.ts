import { INestApplication, ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionFilter } from './common/filters/all.exception.filter';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';

export default (app: INestApplication, config: any) => {
  // 日志替换
  if (config.logger.enable) {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }

  // 全局接口前缀
  app.setGlobalPrefix('api');
  // 接口版本控制
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

  // 全局pipe
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除类上不存在的字段
      whitelist: true,
      // 配置后所有的负载对象转换(Transform) 隐式进行
      //  transform: true,
    }),
  );

  // 全局异常filter 注意顺序
  const httpAdapter = app.get(HttpAdapterHost);
  const logger = new Logger();
  app.useGlobalFilters(
    new AllExceptionFilter(httpAdapter, logger),
    new HttpExceptionFilter(logger),
  );
};
