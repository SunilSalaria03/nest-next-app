import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AUTH, USERS } from 'src/shared/constants/message.constant';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthData } from 'src/shared/interfaces/auth.interface';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async login(data: LoginDto): Promise<AuthData> {
    const user = await this.userModel
      .findOne({ email: data.email })
      .select('+password');
    if (!user) {
      throw new UnauthorizedException(AUTH.LOGIN_FAILED);
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH.LOGIN_FAILED);
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const response: AuthData = {
      user,
      token,
    };
    return response;
  }

  async signup(data: SignupDto): Promise<AuthData> {
    try {
      let subQuery: any = {
        $or: [],
      };
      if (data.email) {
        subQuery.$or.push({ email: data.email.toLowerCase().trim() });
      }
      if (data.phone) {
        subQuery.$or.push({ phone: data.phone });
      }
      if (data.name) {
        subQuery.$or.push({
          name: { $regex: `^${data.name}$`, $options: 'i' },
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
      const newUser = new this.userModel({ ...data, password: hashedPassword });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { userId: savedUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        },
      );
      const response: AuthData = {
        user: savedUser,
        token,
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
