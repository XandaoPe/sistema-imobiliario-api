// src/property/property.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Property, PropertyDocument } from './schema/property.schema';

export interface PaginatedProperties {
    data: Property[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
@Injectable()
export class PropertyService {
    constructor(
        @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    ) { }

    // 🔥 MÉTODO ATUALIZADO COM PAGINAÇÃO
    async findAll(
        companyId?: Types.ObjectId,
        page: number = 1,
        limit: number = 10,
        status?: string
    ): Promise<PaginatedProperties> {
        const filter: any = {};

        if (companyId) {
            filter.companyId = companyId;
        }

        if (status && status !== 'all') {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.propertyModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.propertyModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            total,
            page,
            limit,
            totalPages
        };
    }

    // 🔥 MÉTODO PÚBLICO COM PAGINAÇÃO
    async findPublicProperties(
        page: number = 1,
        limit: number = 12
    ): Promise<PaginatedProperties> {
        const filter = {
            status: 'disponivel',
            isActive: true
        };

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.propertyModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.propertyModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            total,
            page,
            limit,
            totalPages
        };
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
