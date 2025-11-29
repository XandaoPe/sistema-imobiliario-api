import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';

export type ClientDocument = Client & Document;

@Schema({
    timestamps: true,
    collection: 'clients',
})
export class Client {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    // No user.schema.ts e client.schema.ts
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

    @Prop({ required: true })
    phone: string;

    @Prop()
    document: string;

    // CHAVE PARA ISOLAMENTO: Link obrigatório para a Imobiliária
    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    companyId: Types.ObjectId;

    // CORREÇÃO: Adicionar ownerUserId (obrigatório) - VERIFIQUE SE EXISTE!
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    ownerUserId: Types.ObjectId;
}

export const ClientSchema = SchemaFactory.createForClass(Client);