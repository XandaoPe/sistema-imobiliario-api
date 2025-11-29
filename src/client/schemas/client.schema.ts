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

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    document: string; // CPF/CNPJ opcional

    // CHAVE PARA ISOLAMENTO: Link obrigatório para a Imobiliária
    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    companyId: Types.ObjectId;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
