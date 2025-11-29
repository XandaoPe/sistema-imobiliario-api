import { Controller, Post, Body, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Importa o DTO

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    // Aplica validação automática ao corpo da requisição de login
    async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        return this.authService.login(user);
    }
}
