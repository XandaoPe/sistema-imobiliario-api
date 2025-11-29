import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema'; // Importa a classe Company

// Definimos os tipos de perfis permitidos
export type UserRole = 'ADM_GERAL' | 'MODERADOR' | 'CORRETOR';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    collection: 'users',
})
export class User {

    @Prop({
        required: true,
        unique: true,
        validate: {
            validator: async function (email: string) {
                const count = await this.constructor.countDocuments({ email });
                return count === 0;
            },
            message: 'Email já está em uso'
        }
    })
    email: string;

    // A senha será hashed antes de ser salva
    @Prop({ required: true, select: false }) // 'select: false' omite a senha em consultas padrão
    passwordHash: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({
        type: String,
        enum: ['ADM_GERAL', 'MODERADOR', 'CORRETOR'],
        required: true
    })
    role: UserRole;

    @Prop()
    creci: string; // Opcional, apenas para corretores

    // Link crucial: Referência ao ID da imobiliária
    // Type: Types.ObjectId define que será um ID do Mongo
    // ref: 'Company' indica a coleção referenciada
    // required: false porque o ADM_GERAL não pertence a uma imobiliária específica
    @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
    companyId: Types.ObjectId;

    
}

export const UserSchema = SchemaFactory.createForClass(User);
