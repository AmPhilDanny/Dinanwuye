import 'reflect-metadata';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string }) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    const admin = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive or missing');
    }
    return { id: admin.id, email: admin.email, role: admin.role, permissions: admin.permissions };
  }
}