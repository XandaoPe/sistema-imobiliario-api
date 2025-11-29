import { Controller, Post, Delete, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { PermissionService } from './permission.service';
import { Types } from 'mongoose';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post('share')
    async shareEntity(
        @Body() shareData: {
            grantedToUserId: string;
            entityType: string;
            entityId: string;
        },
        @Request() req
    ) {
        return this.permissionService.shareEntity(
            new Types.ObjectId(req.user.userId), // quem compartilha
            new Types.ObjectId(shareData.grantedToUserId), // com quem compartilha
            new Types.ObjectId(req.user.companyId),
            shareData.entityType,
            new Types.ObjectId(shareData.entityId)
        );
    }

    @Delete('revoke')
    async revokeShare(
        @Body() revokeData: {
            grantedToUserId: string;
            entityType: string;
            entityId: string;
        },
        @Request() req
    ) {
        return this.permissionService.revokeShare(
            new Types.ObjectId(req.user.userId),
            new Types.ObjectId(revokeData.grantedToUserId),
            revokeData.entityType,
            new Types.ObjectId(revokeData.entityId)
        );
    }
}