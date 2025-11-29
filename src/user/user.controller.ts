import { Controller, Post, Body, Get, Param, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto'; // Importa o DTO
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADM_GERAL', 'MODERADOR') // Permite ADM_GERAL e MODERADOR
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    // Aplica validação automática
    async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }


    // Exemplo de rota de busca de usuário por email (para testes iniciais)
    @Get('by-email/:email')
    async findByEmail(@Param('email') email: string): Promise<User | null> {
        return this.userService.findByEmail(email);
    }
}
