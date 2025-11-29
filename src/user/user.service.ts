// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    // Tipamos o parâmetro de entrada
    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const createdUser = new this.userModel({
            ...createUserDto,
            passwordHash: hashedPassword,
        });
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        // Usamos .select('+passwordHash') para incluir o campo passwordHash,
        // que marcamos como 'select: false' no schema para segurança.
        return this.userModel.findOne({ email }).select('+passwordHash').exec();
    }

    // Implementar findAll, findOne, etc.
}
