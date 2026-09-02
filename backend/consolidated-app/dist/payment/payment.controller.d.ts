import type { JwtRequest } from '../shared';
import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly payment;
    constructor(payment: PaymentService);
    getSubscription(request: JwtRequest): Promise<{
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
    createCheckout(request: JwtRequest, body: {
        planId: string;
        provider: string;
    }): Promise<{
        checkoutUrl: string;
        sessionId: string;
    }>;
}
//# sourceMappingURL=payment.controller.d.ts.map