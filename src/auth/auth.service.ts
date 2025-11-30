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
        console.log('🔐 Validando usuário:', email);

        const user = await this.userService.findByEmail(email);
        console.log('👤 Usuário encontrado:', user ? 'SIM' : 'NÃO');

        if (user) {
            console.log('🔑 Comparando senha...');
            const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
            console.log('✅ Senha válida:', isPasswordValid);

            if (isPasswordValid) {
                const { passwordHash, ...result } = user;
                console.log('🎯 Usuário validado com sucesso:', result.email, result.role);
                return result;
            }
        }

        console.log('❌ Falha na validação - Credenciais inválidas');
        return null;
    }

    async login(user: any) {
        console.log('👤 Dados do usuário no login:', user);
        
        // CORREÇÃO: Acessar os dados corretamente
        const userData = user._doc ? user._doc : user;
        
        const payload = {
            email: userData.email,
            sub: userData._id.toString(), // ← Convert para string
            role: userData.role,
            companyId: userData.companyId // ← DEVE estar presente
        };
        
        console.log('📦 Payload do JWT:', payload);
        
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    
}