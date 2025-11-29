import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    // Simplificado, pois usamos type: Object no schema
    @IsOptional()
    address: any;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsArray()
    @IsOptional()
    images?: string[];

    // companyId e ownerUserId serão injetados automaticamente pelo backend/auth
    // Não precisamos que o cliente (frontend) os envie no body.
}
