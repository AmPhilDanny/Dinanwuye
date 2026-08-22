import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { OTP_MAX_ATTEMPTS, OTP_RESEND_COOLDOWN_SECONDS, OTP_TTL_SECONDS } from '@dinanwuye/shared';
import * as bcrypt from 'bcrypt';
import { OtpPurpose } from '../auth/dto/auth.dto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a 6-digit OTP, store a bcrypt hash in the DB and log it.
   * Real SMTP/SMS delivery is a Phase 2 task — V0 logs the code so dev flows work.
   */
  async send(identifier: string, purpose: OtpPurpose, userId: string | null): Promise<{ retryAfterSeconds: number }> {
    // Resend cooldown: reuse the most recent unconsumed code if still fresh.
    const recent = await this.prisma.otpCode.findFirst({
      where: { identifier, purpose, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (recent) {
      const elapsedSeconds = (Date.now() - recent.createdAt.getTime()) / 1000;
      if (elapsedSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
        return { retryAfterSeconds: Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds) };
      }
      // Expired but unconsumed — revoke so only the newest code is valid.
      await this.prisma.otpCode.updateMany({
        where: { id: recent.id },
        data: { consumedAt: new Date() },
      });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

    const baseData = {
      identifier,
      codeHash,
      purpose,
      expiresAt,
    };
    await this.prisma.otpCode.create({
      data: userId ? { ...baseData, userId } : baseData,
    });

    // V0 delivery stub — replace with SMTP/SMS provider in Phase 2.
    this.logger.log(`[OTP STUB] ${purpose} code for ${identifier}: ${code} (expires in ${OTP_TTL_SECONDS}s)`);

    return { retryAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS };
  }

  /**
   * Verify a code: enforce expiry, max-attempts and one-time consumption.
   * Returns the userId the code belongs to (or null for pre-signup verification).
   */
  async verify(identifier: string, code: string, purpose: OtpPurpose): Promise<{ userId: string | null }> {
    const record = await this.prisma.otpCode.findFirst({
      where: { identifier, purpose, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new OtpInvalidException('No active code for this identifier');
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await this.prisma.otpCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
      throw new OtpInvalidException('Too many attempts — request a new code');
    }

    await this.prisma.otpCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });

    if (record.expiresAt.getTime() < Date.now()) {
      throw new OtpInvalidException('Code expired — request a new one');
    }

    const matches = await bcrypt.compare(code, record.codeHash);
    if (!matches) {
      throw new OtpInvalidException('Invalid code');
    }

    await this.prisma.otpCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
    return { userId: record.userId };
  }
}

export class OtpInvalidException extends Error {}