import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_PERMISSION_KEY } from './permissions';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['*'],
  admin: ['users:read', 'profiles:read', 'photos:read', 'photos:moderate', 'matches:read', 'matches:moderate', 'swipes:read', 'audit:read', 'admins:read'],
  moderator: ['users:read', 'profiles:read', 'photos:read', 'photos:moderate', 'matches:read', 'matches:moderate', 'swipes:read'],
};

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string>(ADMIN_PERMISSION_KEY, [context.getHandler(), context.getClass()]);
    if (!required) return true;
    const request = context.switchToHttp().getRequest<{ user?: { role?: string; permissions?: string[] } }>();
    const user = request.user;
    const allowed = new Set([...(ROLE_PERMISSIONS[user?.role ?? ''] ?? []), ...(user?.permissions ?? [])]);
    if (!allowed.has('*') && !allowed.has(required)) {
      throw new ForbiddenException('Insufficient admin permission');
    }
    return true;
  }
}
