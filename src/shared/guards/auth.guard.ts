import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'; 
import * as jwt from 'jsonwebtoken'; 
import { USERS } from '../constants/message.constant';
import { UserService } from 'src/modules/users/user.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private readonly reflector: Reflector,) {}
  

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = this.extractToken(authHeader);
    const jwtSecret = process.env.JWT_SECRET;
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
  
    if (isPublic) return true;

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

      const user = await this.userService.getUserBYId(payload.userId);
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
