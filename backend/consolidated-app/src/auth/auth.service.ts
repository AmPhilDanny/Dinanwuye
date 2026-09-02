import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JwtPayload, UserStatus } from '../shared';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.module';
import { OtpService } from '../otp/otp.service';
import { AuthResponseDto, LoginDto, RefreshDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly otp: OtpService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResponseDto> {
    if (!dto.email && !dto.phone) {
      throw new ConflictException('Provide at least an email or a phone number');
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email ?? null }, { phone: dto.phone ?? null }],
      },
    });
    if (existing) {
      throw new ConflictException('An account with this email or phone already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        emailHash: dto.email ? this.hashIdentifier(dto.email) : null,
        phoneHash: dto.phone ? this.hashIdentifier(dto.phone) : null,
        passwordHash,
        status: 'active',
        role: 'user',
      },
    });

    // Phone signups start an OTP verification flow (delivery is a V0 stub).
    if (dto.phone) {
      await this.otp.send(dto.phone, 'signup', user.id);
    }

    const tokens = await this.issueTokens(user.id, user.email, user.phone, user.role, user.status as UserStatus);
    return { userId: user.id, email: user.email ?? undefined, phone: user.phone ?? undefined, ...tokens, isNewUser: true, requiresLiveness: true };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { phone: dto.identifier }, { emailHash: this.hashIdentifier(dto.identifier) }],
      },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    const now = new Date();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    const isStale = !user.lastLoginAt || (now.getTime() - user.lastLoginAt.getTime()) > fourteenDaysMs;

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: now } });

    const tokens = await this.issueTokens(user.id, user.email, user.phone, user.role, user.status as UserStatus);
    return { userId: user.id, email: user.email ?? undefined, phone: user.phone ?? undefined, ...tokens, isNewUser: false, requiresLiveness: isStale };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { userId } = await this.otp.verify(dto.identifier, dto.code, dto.purpose);
    if (!userId) {
      throw new UnauthorizedException('Code is not associated with an account');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Signup-purpose OTP confirms the phone — mark verified.
    if (dto.purpose === 'signup' && !user.isVerified) {
      await this.prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
    }

    const now = new Date();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    const isStale = !user.lastLoginAt || (now.getTime() - user.lastLoginAt.getTime()) > fourteenDaysMs;

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: now } });

    const tokens = await this.issueTokens(user.id, user.email, user.phone, user.role, user.status as UserStatus);
    return { userId: user.id, email: user.email ?? undefined, phone: user.phone ?? undefined, ...tokens, isNewUser: false, requiresLiveness: isStale };
  }

  async refresh(dto: RefreshDto): Promise<TokenPair> {
    let payload: JwtPayload & { jti?: string };
    try {
      payload = this.jwt.verify<JwtPayload & { jti?: string }>(dto.refreshToken, {
        secret: this.config.get<string>('JWT_SECRET') ?? 'insecure-dev-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload.jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const stored = await this.prisma.refreshToken.findUnique({ where: { jti: payload.jti } });
    if (!stored || stored.revokedAt || stored.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token has been revoked or expired');
    }

    // Rotate: revoke the old jti, issue a fresh pair.
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    return this.issueTokens(user.id, user.email, user.phone, user.role, user.status as UserStatus);
  }

  async logout(userId: string, dto: { refreshToken: string }): Promise<{ success: true }> {
    let payload: JwtPayload & { jti?: string };
    try {
      payload = this.jwt.verify<JwtPayload & { jti?: string }>(dto.refreshToken, {
        secret: this.config.get<string>('JWT_SECRET') ?? 'insecure-dev-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.jti) {
      await this.prisma.refreshToken.updateMany({
        where: { jti: payload.jti, userId },
        data: { revokedAt: new Date() },
      });
    }
    return { success: true };
  }

  private async issueTokens(
    userId: string,
    email: string | null,
    phone: string | null,
    role: string,
    status: UserStatus,
  ): Promise<TokenPair> {
    const secret = this.config.get<string>('JWT_SECRET') ?? 'insecure-dev-secret';

    const accessToken = this.jwt.sign(
      { sub: userId, email: email ?? undefined, phone: phone ?? undefined, role, status } satisfies JwtPayload,
      { secret, expiresIn: JWT_EXPIRES_IN },
    );

    const jti = randomUUID();
    const refreshToken = this.jwt.sign({ sub: userId, role, status, jti }, { secret, expiresIn: JWT_REFRESH_EXPIRES_IN });
    await this.prisma.refreshToken.create({
      data: {
        userId,
        jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  private hashIdentifier(value: string): string {
    return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
  }
}
