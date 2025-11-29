// src/client/client.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    ) { }

    // Cria um cliente, exigindo o companyId do contexto logado
    async create(createClientDto: CreateClientDto, companyId: Types.ObjectId): Promise<Client> {
        const createdClient = new this.clientModel({
            ...createClientDto,
            companyId: companyId, // INJETA o ID da imobiliária logada
        });
        return createdClient.save();
    }

    // Busca todos os clientes para uma imobiliária específica (ou todos se ADM Geral)
    async findAll(companyId?: Types.ObjectId): Promise<Client[]> {
        const filter = companyId ? { companyId } : {};
        return this.clientModel.find(filter).exec();
    }

    // Busca um cliente específico, verificando o companyId
    async findOne(id: string, companyId?: Types.ObjectId): Promise<Client | null> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.clientModel.findOne(filter).exec();
    }

    // Implemente métodos para update e delete aqui, sempre verificando o companyId no filtro
}
