import { Controller, Post, Body, UnauthorizedException, ValidationPipe, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Importa o DTO
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Retorna os dados do usuário logado' })
    async getProfile(@Request() req) {
        // O JwtStrategy já valida o token e adiciona os dados no req.user
        return {
            userId: req.user.userId,
            email: req.user.email,
            role: req.user.role,
            companyId: req.user.companyId
        };
    }

}
