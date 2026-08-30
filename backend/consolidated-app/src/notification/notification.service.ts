import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async subscribe(userId: string, body: { endpoint: string; p256dh: string; auth: string }) {
    return this.prisma.pushSubscription.upsert({
      where: { endpoint: body.endpoint },
      create: {
        userId,
        endpoint: body.endpoint,
        p256dh: body.p256dh,
        auth: body.auth,
      },
      update: {
        lastUsedAt: new Date(),
      },
    });
  }

  async sendPush(userId: string, title: string, body: string, data?: any) {
    // V0: log notification - real push implementation in Phase 2
    this.logger.log(`[PUSH STUB] To ${userId}: ${title}`);
    
    return this.prisma.notification.create({
      data: {
        userId,
        type: 'push',
        title,
        body,
        data,
      },
    });
  }
}
