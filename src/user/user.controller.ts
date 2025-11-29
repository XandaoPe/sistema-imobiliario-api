import { Controller, Post, Body, Get, Param, ValidationPipe, UseGuards, HttpStatus, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto'; // Importa o DTO
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Users') // Agrupa este controller na UI do Swagger

@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('ADM_GERAL', 'MODERADOR') // Permite ADM_GERAL e MODERADOR
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('public-register') // NOVO ENDPOINT PÚBLICO
    @ApiOperation({ summary: 'TEMPORARIO: Cria o primeiro usuário ADM_GERAL' })
    @ApiBody({ type: CreateUserDto })
    async publicRegister(@Body(new ValidationPipe()) createUserDto: CreateUserDto, @Res() res) {
        if (createUserDto.role !== 'ADM_GERAL') {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Apenas ADM_GERAL pode ser criado nesta rota temporária.' });
        }
        const user = await this.userService.create(createUserDto);
        return res.status(HttpStatus.CREATED).json(user);
        // usuario criado: a@a.com, pass: 123456, role: ADM_GERAL
    }

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
