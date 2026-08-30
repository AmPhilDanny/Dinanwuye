import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.module';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
    });
  }

  async createCheckout(userId: string, planId: string, provider: string) {
    // V0: log checkout - real payment integration in Phase 2
    this.logger.log(`[CHECKOUT STUB] User ${userId} wants ${planId} via ${provider}`);
    
    return {
      checkoutUrl: `https://checkout.${provider}.com/demo`,
      sessionId: `session_${Date.now()}`,
    };
  }

  async handleWebhook(provider: string, payload: any) {
    // V0: log webhook - real handling in Phase 2
    this.logger.log(`[WEBHOOK STUB] ${provider}: ${JSON.stringify(payload)}`);
    return { received: true };
  }
}
