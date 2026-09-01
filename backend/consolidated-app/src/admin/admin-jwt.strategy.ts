import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.module';
import { AuthGuard } from '@nestjs/passport';

interface AdminJwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
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

  async validate(payload: AdminJwtPayload): Promise<AdminJwtPayload> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Admin account is not active');
    }

    return {
      sub: admin.id,
      email: payload.email,
      role: admin.role,
    };
  }
}

@Injectable()
export class AdminAuthGuard extends AuthGuard('admin-jwt') {}
