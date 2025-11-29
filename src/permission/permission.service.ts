import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) { }

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

        return permissions.map(p => p.entityId);
    }

    // NOVO: Método para compartilhar uma entidade
    async shareEntity(
        grantedByUserId: Types.ObjectId,
        grantedToUserId: Types.ObjectId,
        companyId: Types.ObjectId,
        entityType: string,
        entityId: Types.ObjectId
    ): Promise<Permission> {
        const permission = new this.permissionModel({
            grantedByUserId,
            grantedToUserId,
            companyId,
            entityType,
            entityId
        });
        return permission.save();
    }

    // NOVO: Método para revogar compartilhamento
    async revokeShare(
        grantedByUserId: Types.ObjectId,
        grantedToUserId: Types.ObjectId,
        entityType: string,
        entityId: Types.ObjectId
    ): Promise<boolean> {
        const result = await this.permissionModel.deleteOne({
            grantedByUserId,
            grantedToUserId,
            entityType,
            entityId
        }).exec();

        return result.deletedCount > 0;
    }

    // NOVO: Verificar se usuário tem permissão
    async hasPermission(
        userId: Types.ObjectId,
        entityType: string,
        entityId: Types.ObjectId
    ): Promise<boolean> {
        const permission = await this.permissionModel.findOne({
            grantedToUserId: userId,
            entityType,
            entityId
        }).exec();

        return !!permission;
    }
}