import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USERS } from '../constants/message.constant';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(USERS.USER_NOT_AUTHENTICATED);
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(USERS.USER_NOT_AUTHORIZED);
    }

    return true;
  }
}
