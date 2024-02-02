import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorator/role.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // retrieve required roles from metadata attached to current handler
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // if there are no required roles, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get user roles and check if user has permission.
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
