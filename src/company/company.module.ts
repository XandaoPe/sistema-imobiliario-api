// src/company/company.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
    imports: [
        // Registra o modelo Mongoose dentro deste módulo
        MongooseModule.forFeature([
            { name: Company.name, schema: CompanySchema },
        ]),
    ],
    // Em breve adicionaremos Services e Controllers aqui
    providers: [CompanyService],
    controllers: [CompanyController],
})
export class CompanyModule { }
