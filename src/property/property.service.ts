// src/property/property.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Property, PropertyDocument } from './schema/property.schema';

@Injectable()
export class PropertyService {
    constructor(
        @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    ) { }

    async findAll(companyId?: Types.ObjectId): Promise<Property[]> {
        if (!companyId) {
            console.log('👑 ADM_GERAL ou sem companyId - retornando TODAS as propriedades');
            return this.propertyModel.find().exec(); // ← DEVE RETORNAR TUDO
        }
        const filter = { companyId };
        return this.propertyModel.find(filter).exec();
    }

    // NOVO Método: Para a área pública (Landing Page)
    async findPublicProperties(): Promise<Property[]> {
        // Busca imóveis que estão 'disponivel' (ou o status que você definir)
        // Ordena por data de criação (mais novos primeiro)
        return this.propertyModel.find({ status: 'disponivel', isActive: true }) // Assume que isActive será adicionado ao schema
            .sort({ createdAt: -1 })
            .limit(20) // Limita a 20 resultados para a landing page (pode ser paginado depois)
            .exec();
    }

    // NOVO Método: Para visualização pública de um único imóvel
    async findPublicOne(id: string): Promise<Property | null> {
        return this.propertyModel.findOne({ _id: id, status: 'disponivel', isActive: true }).exec();
    }

    // Cria um imóvel
    async create(createPropertyDto: any, companyId: Types.ObjectId): Promise<Property> {
        console.log('🏗️ Criando propriedade no service:', createPropertyDto);

        const createdProperty = new this.propertyModel({
            ...createPropertyDto,
            companyId: companyId,
        });

        const result = await createdProperty.save();
        console.log('✅ Propriedade criada com sucesso:', result._id);
        return result;
    }

    // Implemente findOne, update e delete, sempre verificando o companyId
    async findOne(id: string, companyId?: Types.ObjectId): Promise<Property> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.propertyModel.findOne(filter).exec();
    }

    async update(id: string, updatePropertyDto: any, companyId?: Types.ObjectId): Promise<Property> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.propertyModel.findOneAndUpdate(filter, updatePropertyDto, { new: true }).exec();
    }

    async delete(id: string, companyId?: Types.ObjectId): Promise<Property> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.propertyModel.findOneAndDelete(filter).exec();
    }
}
