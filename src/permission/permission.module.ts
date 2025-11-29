import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionService } from './permission.service';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { PermissionController } from './permission.controller'; // ← Adicionar

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [PermissionService],
  controllers: [PermissionController], // ← Adicionar
  exports: [PermissionService]
})
export class PermissionModule { }