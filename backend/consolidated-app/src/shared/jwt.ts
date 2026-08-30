/**
 * @dinanwuye/shared — JWT payload types + Passport JWT guard
 * Reused by every service that needs auth verification.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { UserStatus } from './constants';

export interface JwtPayload {
  sub: string; // user id
  email?: string;
  phone?: string;
  role: string;
  status: UserStatus;
  iat?: number;
  exp?: number;
}

export interface JwtRequest {
  user?: JwtPayload;
  [key: string]: unknown;
}

/**
 * Passport JWT guard — verifies Bearer token via jwt-strategy registered
 * in each service's AppModule. Throws 401 when missing/invalid.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtPayload>(err: unknown, user: TUser | false): TUser {
    if (err || !user) {
      throw err instanceof Error ? err : new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}

/** Helper to pull the JWT payload from a request in controllers/gateways. */
export function getUserFromRequest(request: JwtRequest): JwtPayload {
  if (!request.user) {
    throw new UnauthorizedException('Not authenticated');
  }
  return request.user as JwtPayload;
}
