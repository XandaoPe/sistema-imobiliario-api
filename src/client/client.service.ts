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
        private permissionService: PermissionService,
    ) { }

    // CORREÇÃO: Adicionar ownerUserId na criação
    async create(createClientDto: CreateClientDto, companyId: Types.ObjectId, ownerUserId: Types.ObjectId): Promise<Client> {
        console.log('📝 Criando cliente:', {
            companyId,
            ownerUserId,
            dados: createClientDto
        });

        const createdClient = new this.clientModel({
            ...createClientDto,
            companyId: companyId,
            ownerUserId: ownerUserId, // ← DEVE ESTAR AQUI
        });

        const savedClient = await createdClient.save();
        console.log('✅ Cliente criado:', savedClient);
        return savedClient;
    }

    // CORREÇÃO: Lógica de permissões funcionando
    async findAll(userId: Types.ObjectId, userRole: string, companyId?: Types.ObjectId): Promise<Client[]> {
        if (userRole === 'ADM_GERAL') {
            return this.clientModel.find().exec();
        }

        // Busca IDs de clientes compartilhados
        const sharedClientIds = await this.permissionService.getSharedEntityIds(userId, companyId, 'Client');

        // Filtro CORRETO: Meus clientes OU clientes compartilhados comigo
        const filter = {
            $or: [
                { ownerUserId: userId }, // ← AGORA ownerUserId existe
                { _id: { $in: sharedClientIds } }
            ],
            companyId: companyId
        };

        return this.clientModel.find(filter).exec();
    }

    async findOne(id: string, companyId?: Types.ObjectId): Promise<Client | null> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.clientModel.findOne(filter).exec();
    }

    async update(id: string, updateClientDto: any, companyId?: Types.ObjectId): Promise<Client> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.clientModel.findOneAndUpdate(filter, updateClientDto, { new: true }).exec();
    }

    async delete(id: string, companyId?: Types.ObjectId): Promise<Client> {
        const filter = companyId ? { _id: id, companyId } : { _id: id };
        return this.clientModel.findOneAndDelete(filter).exec();
    }
}