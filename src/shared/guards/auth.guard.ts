import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
} from 'src/modules/users/schemas/user.schema';
import { USERS } from '../constants/message.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = this.extractToken(authHeader);
    const jwtSecret = process.env.JWT_SECRET;

    if (!token || !jwtSecret) {
      throw new UnauthorizedException(USERS.USER_NOT_AUTHENTICATED);
    }

    try {
      const payload = jwt.verify(token, jwtSecret) as jwt.JwtPayload & {
        userId?: string;
      };

      if (!payload.userId) {
        throw new UnauthorizedException(USERS.USER_NOT_AUTHENTICATED);
      }

      const user = await this.userModel.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedException(USERS.USER_NOT_AUTHENTICATED);
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException(USERS.USER_NOT_AUTHENTICATED);
    }
  }

  private extractToken(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
