// src/app.module.ts (Atualizado)

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importe ConfigService
import { MongooseModule } from '@nestjs/mongoose'; // Importe MongooseModule
import { AppController } from './app.controller';
import { AppService }  from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexão com o MongoDB usando Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Pega a URI do .env
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
