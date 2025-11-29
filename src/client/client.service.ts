// src/client/client.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class ClientService {
    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
        private permissionService: PermissionService, // Injete o serviço de permissões

    ) { }

    // Cria um cliente, exigindo o companyId do contexto logado
    async create(createClientDto: CreateClientDto, companyId: Types.ObjectId): Promise<Client> {
        const createdClient = new this.clientModel({
            ...createClientDto,
            companyId: companyId, // INJETA o ID da imobiliária logada
        });
        return createdClient.save();
    }

    async findAll(userId: Types.ObjectId, userRole: string, companyId?: Types.ObjectId): Promise<Client[]> {
        if (userRole === 'ADM_GERAL') {
            return this.clientModel.find().exec();
        }

        // Lógica complexa: Encontra clientes do próprio usuário OU clientes que foram compartilhados com ele
        const sharedClientIds = await this.permissionService.getSharedEntityIds(userId, companyId, 'Client');

        // Filtro OR: [Meus Clientes] OU [Clientes Compartilhados Comigo] E [Da Minha Empresa]
        const filter = {
            $or: [
                { ownerUserId: userId }, // Precisamos adicionar ownerUserId ao schema Client (veja nota abaixo)
                { _id: { $in: sharedClientIds } }
            ],
            companyId: companyId
        };

        return this.clientModel.find(filter).exec();
    }

    // Busca um cliente específico, verificando o companyId
    async findOne(id: string, companyId?: Types.ObjectId): Promise<Client | null> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.clientModel.findOne(filter).exec();
    }

    // Implemente métodos para update e delete aqui, sempre verificando o companyId no filtro
}
