// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        // Registra o modelo Mongoose dentro deste módulo
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [],
    controllers: [],
    exports: [MongooseModule] // Exportamos MongooseModule para que outros módulos possam usar o modelo User (ex: AuthModule)
})
export class UserModule { }
