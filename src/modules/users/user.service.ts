import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { USERS } from 'src/shared/constants/message.constant';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/shared/interfaces/user.interface';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getAllUsers(): Promise<IUser[]> {
    const users = await this.userModel.find();
    return users;
  }

  async getUserBYId(_id: Types.ObjectId): Promise<IUser> {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException(USERS.USER_NOT_FOUND);
    }
    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try {
        let subQuery: any = {
            $or: [],
          };
          
          if (data.name) {
            subQuery.$or.push({
              name: { $regex: `^${data.name}$`, $options: "i" },
            });
          }
          
          if (data.email) {
            subQuery.$or.push({
              email: data.email.toLowerCase().trim(),
            });
          }
          
          if (data.phone) {
            subQuery.$or.push({
              phone: data.phone,
            });
          }
          
           if (subQuery.$or.length === 0) {
            subQuery = {};
          }
          
          const user = await this.userModel.findOne(subQuery);
      if (user) {
        throw new BadRequestException(USERS.USER_ALREADY_EXISTS);
      }
      const hashedPassword = await bcrypt.hash(
        data.password,
        Number(process.env.SALT),
      );
      const newUser = new this.userModel({
        ...data,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUser(data: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(data._id, data, { new: true });
    try {
      if (!user) {
        throw new NotFoundException(USERS.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteUser(_id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(_id);
    try {
      if (!user) {
        throw new NotFoundException(USERS.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
