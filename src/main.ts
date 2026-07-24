import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5556);
  console.log('Transfer service listening on http://localhost:5556');
}
bootstrap();
