import { Controller, Get, Post, Body, Param, ValidationPipe, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto'; // Importa o DTO
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica ambos os guards no nível do controlador
@Roles('ADM_GERAL') // Apenas ADM_GERAL pode acessar TODAS as rotas aqui
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    // Usamos o ValidationPipe globalmente ou localmente para validar automaticamente o DTO
    async create(@Body(new ValidationPipe()) createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @Get()
    async findAll(): Promise<Company[]> {
        return this.companyService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Company> {
        return this.companyService.findOne(id);
    }
}
