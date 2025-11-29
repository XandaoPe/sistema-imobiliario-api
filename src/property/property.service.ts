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

    // Este método aceita um companyId opcional para filtragem
    async findAll(companyId?: Types.ObjectId): Promise<Property[]> {
        const filter = companyId ? { companyId } : {}; // Aplica filtro se companyId existir
        return this.propertyModel.find(filter).exec();
    }

    // Cria um imóvel, exigindo o companyId do contexto logado
    async create(createPropertyDto: CreatePropertyDto, companyId: Types.ObjectId): Promise<Property> {
        const createdProperty = new this.propertyModel({
            ...createPropertyDto,
            companyId: companyId, // INJETA o ID da imobiliária logada
            ownerUserId: null, // Pode ser preenchido depois
        });
        return createdProperty.save();
    }

    // Implemente findOne, update e delete, sempre verificando o companyId
    async findOne(id: string, companyId?: Types.ObjectId): Promise<Property> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.propertyModel.findOne(filter).exec();
    }
}
