import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export @Schema()
class Address {
    @Prop() street: string;
    @Prop() city: string;
    @Prop() state: string;
    @Prop() zipCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
