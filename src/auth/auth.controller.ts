import { Controller, Post, Body, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Importa o DTO
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação') // Agrupa este controller na UI do Swagger
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Realiza o login e retorna um token JWT' }) // Descrição da operação

    // Aplica validação automática ao corpo da requisição de login
    async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        return this.authService.login(user);
    }
}
