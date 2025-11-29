// src/property/property.controller.ts (REMODELADO PARA IMAGEM)

import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    ValidationPipe,
    UseInterceptors,       // Importe UseInterceptors
    UploadedFile,         // Importe UploadedFile
    NotFoundException     // Importe NotFoundException
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express'; // Importe FileInterceptor
import { diskStorage } from 'multer'; // Importe diskStorage
import { extname } from 'path'; // Importe extname
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

// 1. Configuração de Armazenamento Local (Mover isso para fora do controller se preferir)
const storage = diskStorage({
    destination: './uploads/property-images', // Garanta que esta pasta exista ou seja criada
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16))).join('');
        // Nome do arquivo será um hash aleatório + extensão original
        return cb(null, `${randomName}${extname(file.originalname)}`);
    },
});
@ApiTags('Imóveis (Protegido)')
@ApiBearerAuth('access-token') // Adiciona o botão de autorização JWT a esta seção

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('properties')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo imóvel (requer autenticação)' })
    @ApiConsumes('multipart/form-data') // Indica ao Swagger que o formato é multipart/form-data
   // 2. Aplica o Interceptor para processar o campo 'image' do formulário
    @UseInterceptors(FileInterceptor('image', { storage }))
    async create(
        @Body(new ValidationPipe()) createPropertyDto: CreatePropertyDto,
        @Request() req,
        @UploadedFile() file: Express.Multer.File // 3. Recebe o objeto do arquivo processado
    ) {
        if (!file) {
            // Se nenhuma imagem for enviada, lançamos um erro
            throw new NotFoundException('A imagem principal é obrigatória para o cadastro do imóvel.');
        }

        // 4. Adiciona o caminho local do arquivo ao DTO para salvar no DB
        // Na produção, este caminho seria a URL pública do seu serviço de cloud (S3, Azure Blob, etc.)
        createPropertyDto.images = [file.path];

        return this.propertyService.create(createPropertyDto, new Types.ObjectId(req.user.companyId));
    }

    @Get()
    @ApiOperation({ summary: 'Lista imóveis da imobiliária do usuário logado' })

    async findAll(@Request() req) {
        // ... (lógica de findAll existente) ...
        const companyIdToFilter = req.user.role === 'ADM_GERAL' ? undefined : new Types.ObjectId(req.user.companyId);
        return this.propertyService.findAll(companyIdToFilter);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        // ... (lógica de findOne existente) ...
        const companyIdToFilter = req.user.role === 'ADM_GERAL' ? undefined : new Types.ObjectId(req.user.companyId);
        return this.propertyService.findOne(id, companyIdToFilter);
    }
}
