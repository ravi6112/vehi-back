import { AppGateway } from './app.gateway';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const webSocketService = new AppGateway();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  console.log('socket cluster calling ');
  webSocketService.onComplete();
  console.log('passed the service');
}
bootstrap();
