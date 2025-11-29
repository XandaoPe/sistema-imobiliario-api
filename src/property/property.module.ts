// src/property/property.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from './schema/property.schema';
import { PropertyPublicController } from 'src/property/property-public.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  providers: 
  [
    PropertyService
  ],
  controllers: 
  [
      PropertyController,      // Rota /properties (Protegida)
      PropertyPublicController // Rota /public/properties (Pública)
  ],
  exports: 
  [
    PropertyService
  ],
})
export class PropertyModule { }
