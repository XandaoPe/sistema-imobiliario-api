// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { Address, AddressSchema } from './address.schema';

// // Exportamos o tipo para uso futuro (type safety)
// export type CompanyDocument = Company & Document;

// @Schema({
//     timestamps: true, // Adiciona createdAt e updatedAt automaticamente
//     collection: 'companies', // Define o nome da coleção no MongoDB
// })
// export class Company {
//     @Prop({ required: true, unique: true })
//     name: string;

//     @Prop({ required: true, unique: true })
//     cnpj: string;

//     @Prop({ required: true })
//     email: string;

//     @Prop({ type: AddressSchema }) // Referencia o novo Schema
//     address: Address; 

//     @Prop({ default: true })
//     isActive: boolean;
// }

// // Exportamos o SchemaFactory para uso no módulo
// export const CompanySchema = SchemaFactory.createForClass(Company);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address } from './address.schema'; // Importa a classe Address

export type CompanyDocument = Company & Document;

@Schema({
    timestamps: true,
    collection: 'companies',
})
export class Company {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, unique: true })
    cnpj: string;

    @Prop({ required: true })
    email: string;

    // Usa a classe Address como o tipo aninhado
    @Prop()
    address: Address;

    @Prop({ default: true })
    isActive: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
