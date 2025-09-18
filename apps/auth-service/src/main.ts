import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AuthServiceModule);
  await app.init();
}
bootstrap();
