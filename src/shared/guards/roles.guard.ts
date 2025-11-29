// src/shared/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/schemas/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Pega as roles necessárias da rota (definidas pelo @Roles decorator)
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            // Se a rota não tiver @Roles(), permite o acesso (JwtAuthGuard já validou o token)
            return true;
        }

        // 2. Pega o usuário do Request (adicionado pelo JwtStrategy)
        const { user } = context.switchToHttp().getRequest();

        // 3. Verifica se o usuário tem pelo menos uma das roles necessárias
        // Importante: ADM_GERAL sempre tem acesso total
        return requiredRoles.some((role) => user.role === 'ADM_GERAL' || user.role === role);
    }
}
