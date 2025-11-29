import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'E-mail do usuário para login', example: 'corretor@imobiliaria.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Senha do usuário', example: 'SenhaSegura123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
