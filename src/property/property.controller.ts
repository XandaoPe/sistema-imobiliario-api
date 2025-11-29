// src/property/property.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Types } from 'mongoose';

@UseGuards(JwtAuthGuard, RolesGuard) // Protege as rotas, mas permite todos os roles válidos
@Controller('properties')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) { }

    @Post()
    async create(
        @Body(new ValidationPipe()) createPropertyDto: CreatePropertyDto,
        @Request() req
    ) {
        return this.propertyService.create(createPropertyDto, new Types.ObjectId(req.user.companyId));
    }

    @Get()
    async findAll(@Request() req) {
        // A lógica de ADM_GERAL vs outros ainda precisa ser refinada aqui no Service/Controller.
        // Por enquanto, todos só vêm os seus próprios (usando req.user.companyId)
        const companyIdToFilter = req.user.role === 'ADM_GERAL' ? undefined : new Types.ObjectId(req.user.companyId);
        return this.propertyService.findAll(companyIdToFilter);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        const companyIdToFilter = req.user.role === 'ADM_GERAL' ? undefined : new Types.ObjectId(req.user.companyId);
        return this.propertyService.findOne(id, companyIdToFilter);
    }
}
