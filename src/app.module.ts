// src/app.module.ts (Final)

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module'; // Importe CompanyModule
import { UserModule } from './user/user.module'; // Importe UserModule
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { PropertyPublicController } from './property/property-public.controller';

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
    UserModule, 
    AuthModule, 
    PropertyModule,   // Adicione UserModule
  ],
  controllers: [AppController, AuthController, PropertyPublicController],
  providers: [AppService, AuthService],
})
export class AppModule { }

