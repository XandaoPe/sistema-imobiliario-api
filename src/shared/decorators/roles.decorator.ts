// src/shared/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/schemas/user.schema';

// Definimos uma chave constante para armazenar os metadados das roles
export const ROLES_KEY = 'roles';

// O decorator aceita uma ou mais roles permitidas
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
