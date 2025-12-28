
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, index: true })
  email: string;

  @Prop({ unique: true, index: true })
  nestId: string; // Generated ID (e.g., NEST2025U0001)

  @Prop({ select: false }) // Hide password by default
  password?: string;

  @Prop({ unique: true, index: true })
  phone: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  photo?: string; // URL

  @Prop({ type: [String], enum: ['user', 'admin', 'provider'], default: ['user'] })
  roles: string[];

  // Profile Details
  @Prop()
  age?: number;

  @Prop()
  gender?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  country?: string;

  @Prop({ default: false })
  idCardGenerated: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
