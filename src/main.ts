import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // URLs do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Adiciona o ValidationPipe globalmente para todos os DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão definidas no DTO
    forbidNonWhitelisted: true, // Lança um erro se propriedades extras forem enviadas
    transform: true, // Transforma automaticamente payloads em instâncias de DTO
  }));

  // --- Configuração do Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API Sistema Imobiliário')
    .setDescription('Documentação completa dos endpoints do backend imobiliário.')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Insira o token JWT para autenticação',
      in: 'header',
    },
      'access-token' // Nome do esquema de segurança (usaremos isso nos Controllers)
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // O Swagger UI estará disponível em http://localhost:3000/api-docs
  SwaggerModule.setup('api-docs', app, document);
  // -------------------------------

  await app.listen(5000);
}
bootstrap();
