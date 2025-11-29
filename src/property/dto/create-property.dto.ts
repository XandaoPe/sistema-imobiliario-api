import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
    @ApiProperty({ description: 'Título do imóvel', example: 'Apartamento Luxuoso' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Descrição do imóvel', required: false, example: 'Excelente apartamento com vista para o mar' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Endereço do imóvel (JSON string)',
        required: false,
        example: '{"street": "Av. Paulista, 1000", "city": "São Paulo", "state": "SP"}'
    })
    @IsOptional()
    address: any;

    @ApiProperty({ description: 'Preço do imóvel', example: 350000 })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number) // ← ADICIONE ESTA LINHA!
    @IsPositive({ message: 'O preço deve ser positivo' })
    price: number;

    @ApiProperty({ description: 'Status do imóvel', required: false, example: 'disponivel' })
    @IsString()
    @IsOptional()
    @IsIn(['disponivel', 'vendido', 'alugado'], { message: 'Status deve ser: disponivel, vendido ou alugado' })
    status?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Imagem principal do imóvel'
    })
    @IsOptional()
    image: any;
}