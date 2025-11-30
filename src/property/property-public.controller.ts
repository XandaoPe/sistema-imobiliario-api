// src/property-public/property-public.controller.ts

import { Controller, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './schema/property.schema';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('public/properties') // Rotas: /public/properties
export class PropertyPublicController {
    constructor(private readonly propertyService: PropertyService) { }

    // 🔥 ENDPOINT ATUALIZADO COM PAGINAÇÃO
    @Get()
    @ApiOperation({ summary: 'Lista imóveis públicos para landing page' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página atual' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
    async getLandingPageProperties(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 12
    ) {
        return this.propertyService.findPublicProperties(page, limit);
    }

    // Endpoint para a página de detalhes do imóvel (quando o usuário clica no card)
    @Get(':id')
    async getPublicPropertyDetails(@Param('id') id: string): Promise<Property> {
        const property = await this.propertyService.findPublicOne(id);
        if (!property) {
            throw new NotFoundException('Imóvel não encontrado ou não disponível.');
        }
        return property;
    }
}
