// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);

        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            // Remove o hash da senha do objeto de retorno para segurança
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // Payload do JWT: Inclui companyId e role para controle de acesso futuro
        const payload = {
            email: user.email,
            sub: user._doc._id, // MongoDB _id
            role: user.role,
            companyId: user.companyId // A CHAVE DO NOSSO SISTEMA MULTI-TENANT
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
