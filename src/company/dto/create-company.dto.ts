import { IsString, IsNotEmpty, IsEmail, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    cnpj: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ValidateNested()
    @Type(() => CreateAddressDto)
    address: CreateAddressDto;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
