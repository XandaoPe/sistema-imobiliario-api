import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Adiciona o ValidationPipe globalmente para todos os DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão definidas no DTO
    forbidNonWhitelisted: true, // Lança um erro se propriedades extras forem enviadas
    transform: true, // Transforma automaticamente payloads em instâncias de DTO
  }));

  await app.listen(3000);
}
bootstrap();
