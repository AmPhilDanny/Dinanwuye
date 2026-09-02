import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.module';
export declare class PaymentService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    getSubscription(userId: string): Promise<{
        status: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string;
        providerId: string;
        planId: string;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        cancelAt: Date | null;
        canceledAt: Date | null;
    } | null>;
    createCheckout(userId: string, planId: string, provider: string): Promise<{
        checkoutUrl: string;
        sessionId: string;
    }>;
    handleWebhook(provider: string, payload: any): Promise<{
        received: boolean;
    }>;
}
//# sourceMappingURL=payment.service.d.ts.map