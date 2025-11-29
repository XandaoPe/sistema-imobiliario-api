import { IsString, IsNotEmpty, IsEmail, IsIn, IsOptional } from 'class-validator';
import { UserRole } from '../schemas/user.schema'; // Importa os tipos de perfis

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    // Nota: A senha será validada aqui, mas hashada no service
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    // Garante que o perfil seja um dos valores permitidos
    @IsIn(['ADM_GERAL', 'MODERADOR', 'CORRETOR'])
    role: UserRole;

    @IsString()
    @IsOptional()
    creci?: string;

    @IsString()
    @IsOptional()
    // Opcional na criação, pois o ADM_GERAL não tem companyId
    companyId?: string;
}
