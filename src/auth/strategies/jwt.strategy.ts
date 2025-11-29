// src/auth/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Define a interface do payload que esperamos do token JWT
export interface JwtPayload {
    email: string;
    sub: string;
    role: string;
    companyId?: string; // Importante para o nosso sistema
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    // Esta função é chamada automaticamente quando um token JWT válido é processado
    async validate(payload: JwtPayload) {
        // Adiciona o payload (incluindo role e companyId) ao objeto req.user do Express
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            companyId: payload.companyId
        };
    }
}
