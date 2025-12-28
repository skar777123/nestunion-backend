
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CounterDocument = Counter & Document;

@Schema()
export class Counter {
    @Prop({ required: true, unique: true })
    id: string; // e.g., 'user_id', 'provider_lb', 'provider_at'

    @Prop({ default: 0 })
    seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
