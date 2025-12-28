
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InteractionDocument = Interaction & Document;

export enum InteractionStatus {
    REQUESTED = 'requested',
    ACCEPTED = 'accepted',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Interaction {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    customerId: string; // The user requesting the service

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true })
    providerId: string; // The service provider

    @Prop({ required: true })
    serviceCategory: string; // Snapshot of provider category at time of booking

    @Prop({ default: InteractionStatus.REQUESTED, enum: InteractionStatus })
    status: InteractionStatus;

    @Prop()
    scheduledTime?: Date;

    @Prop()
    completionTime?: Date;

    @Prop()
    customerNote?: string;

    // Payment/Cost tracking (simplified)
    @Prop()
    agreedAmount?: number;

    @Prop({ default: false })
    isPaid: boolean;

    // Rating
    @Prop()
    rating?: number;

    @Prop()
    review?: string;
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);
