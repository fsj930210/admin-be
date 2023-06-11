import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger-setup';
import configuration from './configuration';
import setup from './setup';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = configuration();

  setup(app, config);

  // swagger
  setupSwagger(app);

  await app.listen(config?.app?.port || 3000);

  return app;
}
bootstrap();
