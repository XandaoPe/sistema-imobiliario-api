// src/app.module.ts (Final)

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module'; // Importe CompanyModule
import { UserModule } from './user/user.module'; // Importe UserModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CompanyModule, // Adicione CompanyModule
    UserModule,    // Adicione UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

