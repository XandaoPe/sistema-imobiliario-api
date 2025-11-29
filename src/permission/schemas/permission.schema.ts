// src/permission/schemas/permission.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Company } from '../../company/schemas/company.schema';

export type PermissionDocument = Permission & Document;

@Schema({
    timestamps: true,
    collection: 'permissions',
})
export class Permission {
    // A imobiliária que concede a permissão
    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    companyId: Types.ObjectId;

    // O usuário (Corretor/Moderador) que está concedendo a permissão (o "dono" do dado original)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    grantedByUserId: Types.ObjectId;

    // O usuário (Corretor/Moderador) que recebe a permissão de visualização
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    grantedToUserId: Types.ObjectId;

    // O tipo de entidade que está sendo compartilhada (Ex: 'Client', 'Property')
    @Prop({ type: String, required: true })
    entityType: string;

    // O ID do registro específico que está sendo compartilhado
    @Prop({ type: Types.ObjectId, required: true })
    entityId: Types.ObjectId;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
