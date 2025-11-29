// src/property-public/property-public.controller.ts

import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './schema/property.schema';

@Controller('public/properties') // Rotas: /public/properties
export class PropertyPublicController {
    constructor(private readonly propertyService: PropertyService) { }

    // Endpoint para a listagem da Landing Page
    @Get()
    async getLandingPageProperties(): Promise<Property[]> {
        return this.propertyService.findPublicProperties();
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
