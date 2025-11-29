// src/company/company.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';

@Module({
    imports: [
        // Registra o modelo Mongoose dentro deste módulo
        MongooseModule.forFeature([
            { name: Company.name, schema: CompanySchema },
        ]),
    ],
    // Em breve adicionaremos Services e Controllers aqui
    providers: [],
    controllers: [],
})
export class CompanyModule { }
