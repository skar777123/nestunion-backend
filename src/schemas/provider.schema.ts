
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProviderDocument = Provider & Document;

export enum ProviderCategory {
    AUTO_TAXI = 'Auto / Taxi',
    DUKANDAR = 'Dukandar',
    LABOUR = 'Labour',
    DELIVERY = 'Delivery',
    FARMER = 'Farmer',
    ELECTRICIAN_PLUMBER = 'Electrician / Plumber',
}

@Schema({ timestamps: true })
export class Provider {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: string; // Link to the registered user

    @Prop({ unique: true, index: true })
    nestId: string; // Generated ID (e.g., NEST2025LB0001)

    @Prop({ required: true, enum: ProviderCategory })
    category: ProviderCategory;

    // Generic business/display name (e.g., Shop Name for Dukandar, or just Name for Labour)
    @Prop({ required: true })
    displayName: string;

    @Prop({ required: true })
    phone: string;

    // Location Details
    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    pincode: string;

    @Prop({ type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] })
    location?: { type: string; coordinates: number[] }; // Geospatial index support

    // Professional Details
    @Prop()
    experienceYears?: number;

    @Prop([String])
    skills?: string[]; // Specific skills e.g., "Wiring", "Pipe Fitting" for Plumber

    @Prop()
    vehicleNumber?: string; // For Auto/Taxi/Delivery

    @Prop()
    shopCategory?: string; // For Dukandar

    @Prop()
    description?: string;

    // Media
    @Prop([String])
    images: string[]; // Work samples, Shop images, Vehicle images

    @Prop([String])
    documents: string[]; // Verification docs

    // Status & Verification
    @Prop({ default: true })
    isAvailable: boolean;

    @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
    verificationStatus: string;

    @Prop()
    rejectionReason?: string;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ default: 0 })
    reviewCount: number;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
ProviderSchema.index({ location: '2dsphere' });
