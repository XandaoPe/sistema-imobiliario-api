// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service'; // Importe o serviço
import { UserController } from './user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [UserService], // <-- Deve estar aqui
    controllers: [UserController],
    exports: [UserService, MongooseModule] // <-- DEVE EXPORTAR O UserService AQUI
})
export class UserModule { }
