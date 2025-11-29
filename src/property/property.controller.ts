// src/property/property.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@UseGuards(JwtAuthGuard) // Protege TODAS as rotas deste controller
@Controller('properties')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) { }

    @Post()
    async create(
        @Body(new ValidationPipe()) createPropertyDto: CreatePropertyDto,
        @Request() req // Acessa o objeto Request que contém user.companyId do token
    ) {
        // Injeta o companyId automaticamente do usuário logado
        return this.propertyService.create(createPropertyDto, req.user.companyId);
    }

    @Get()
    async findAll(@Request() req) {
        // Implementaremos a lógica de ADM_GERAL vs MODERADOR/CORRETOR depois.
        // Por enquanto, todos os logados só vêem os seus:
        return this.propertyService.findAll(req.user.companyId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        // Garante que o usuário só possa ver o imóvel se pertencer à sua imobiliária
        return this.propertyService.findOne(id, req.user.companyId);
    }
}
