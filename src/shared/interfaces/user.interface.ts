import { Types } from 'mongoose';
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  password?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address?: string;
  phone?: string;
  isDeleted?: boolean;
  role?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  message: string;
  data: IUser | null;
}

export interface UsersResponse {
  message: string;
  data: IUser[];
}
