// src/client/client.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards, Request, ValidationPipe, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './schemas/client.schema';
import { Types } from 'mongoose';

@Controller('clients') // Rotas: /clients
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADM_GERAL', 'MODERADOR', 'CORRETOR') // Todos os logados podem acessar
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post()
    async create(
        @Body(new ValidationPipe()) createClientDto: CreateClientDto,
        @Request() req
    ): Promise<Client> {
        // Injeta o companyId automaticamente do usuário logado
        return this.clientService.create(createClientDto, new Types.ObjectId(req.user.companyId));
    }

    @Get()
    async findAll(@Request() req): Promise<Client[]> {
        // ADM Geral vê todos, outros perfis só vêem os da sua imobiliária
        const companyIdToFilter = req.user.role === 'ADM_GERAL' ? undefined : new Types.ObjectId(req.user.companyId);
        return this.clientService.findAll(companyIdToFilter);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req): Promise<Client> {
        const companyIdToFilter = req.user.role === 'ADM_GERAL' ? undefined : new Types.ObjectId(req.user.companyId);
        const client = await this.clientService.findOne(id, companyIdToFilter);

        if (!client) {
            throw new NotFoundException('Cliente não encontrado ou você não tem permissão.');
        }
        return client;
    }
}
