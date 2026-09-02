import { PrismaService } from '../prisma/prisma.module';
import { OtpPurpose } from '../auth/dto/auth.dto';
export declare class OtpService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    /**
     * Generate a 6-digit OTP, store a bcrypt hash in the DB and log it.
     * Real SMTP/SMS delivery is a Phase 2 task — V0 logs the code so dev flows work.
     */
    send(identifier: string, purpose: OtpPurpose, userId: string | null): Promise<{
        retryAfterSeconds: number;
    }>;
    /**
     * Verify a code: enforce expiry, max-attempts and one-time consumption.
     * Returns the userId the code belongs to (or null for pre-signup verification).
     */
    verify(identifier: string, code: string, purpose: OtpPurpose): Promise<{
        userId: string | null;
    }>;
}
export declare class OtpInvalidException extends Error {
}
//# sourceMappingURL=otp.service.d.ts.map