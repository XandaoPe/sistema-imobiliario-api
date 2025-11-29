// src/permission/permission.service.ts (CORRIGIDO 2)

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) { }

    // NOVO MÉTODO NECESSÁRIO
    async getSharedEntityIds(
        userId: Types.ObjectId,
        companyId: Types.ObjectId,
        entityType: string
    ): Promise<Types.ObjectId[]> {
        const permissions = await this.permissionModel.find({
            companyId: companyId,
            grantedToUserId: userId,
            entityType: entityType,
        }).exec();

        // Retorna apenas uma lista dos IDs dos registros compartilhados
        return permissions.map(p => p.entityId);
    }
}
