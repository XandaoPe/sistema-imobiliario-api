import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
import { User } from '../../user/schemas/user.schema';

export type PropertyDocument = Property & Document;

@Schema({
    timestamps: true,
    collection: 'properties',
})
export class Property {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ type: Object })
    address: Record<string, any>;

    @Prop({ required: true, type: Number })
    price: number;

    @Prop({ default: 'disponivel' })
    status: string; // Ex: 'disponivel', 'vendido', 'alugado'

    @Prop({ type: [String] }) // Array de URLs de imagens
    images: string[];

    // CHAVE 1 PARA ISOLAMENTO: Link obrigatório para a Imobiliária
    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    companyId: Types.ObjectId;

    // CHAVE 2 PARA ISOLAMENTO: Link para o Corretor responsável (opcional)
    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    ownerUserId?: Types.ObjectId;

    @Prop({ default: true })
    isActive : boolean;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
