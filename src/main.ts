import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionFilter } from './common/filters/all.exception.filter';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { setupSwagger } from './swagger-setup';

// declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  // 全局接口前缀
  app.setGlobalPrefix('/api');
  // 接口版本控制
  app.enableVersioning({
    defaultVersion: [VERSION_NEUTRAL, '1', '2'],
    type: VersioningType.URI,
  });

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局异常filter 注意顺序
  app.useGlobalFilters(
    new AllExceptionFilter(httpAdapter),
    new HttpExceptionFilter(),
  );
  // swagger
  setupSwagger(app);
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
  await app.listen(3000);
}
bootstrap();
