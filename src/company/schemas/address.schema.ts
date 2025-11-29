
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Address {
    @Prop() street: string;
    @Prop() city: string;
    @Prop() state: string;
    @Prop() zipCode: string;
}
// Não precisa exportar o SchemaFactory aqui, pois será um subdocumento.
