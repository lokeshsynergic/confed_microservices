import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(UserServiceModule);
  await app.init();
 // await app.listen(process.env.port ?? 3000);
}
bootstrap();
