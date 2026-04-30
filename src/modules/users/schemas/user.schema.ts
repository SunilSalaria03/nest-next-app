import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;
  @Prop({
    required: true,
    trim: true,
  })
  age: number;

  @Prop({
    required: true,
    trim: true,
  })
  gender: 'male' | 'female' | 'other';
  @Prop({
    required: true,
    trim: true,
  })
  address: string;
  @Prop({
    required: true,
    trim: true,
  })
  phone: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;
  @Prop({
    default: false,
    select: false,
  })
  @Prop({
    default: false,
    select: false,
  }) 
  isDeleted: boolean;

  @Prop({
    default: 1, 
  })
  role: number;
 
}

export const UserSchema = SchemaFactory.createForClass(User);
