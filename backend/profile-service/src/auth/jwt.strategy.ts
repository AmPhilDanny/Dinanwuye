import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@dinanwuye/shared';
import { PrismaService } from '../prisma/prisma.module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'insecure-dev-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: payload.sub },
      select: { isActive: true },
    });

    if (profile && !profile.isActive) {
      throw new UnauthorizedException('Profile is deactivated');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      status: payload.status,
    };
  }
}