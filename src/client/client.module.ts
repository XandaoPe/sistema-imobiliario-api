// src/client/client.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client, ClientSchema } from './schemas/client.schema';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
    ]),
    PermissionModule,
  ],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule { }
