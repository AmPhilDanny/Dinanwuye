import 'reflect-metadata';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dinanwuye-admin-secret',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}