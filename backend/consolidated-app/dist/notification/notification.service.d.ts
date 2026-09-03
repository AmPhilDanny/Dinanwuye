import { PrismaService } from '../prisma/prisma.module';
export declare class NotificationService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getNotifications(userId: string): Promise<{
        type: string;
        title: string;
        id: string;
        userId: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        body: string;
        readAt: Date | null;
        sentAt: Date;
    }[]>;
    subscribe(userId: string, body: {
        endpoint: string;
        p256dh: string;
        auth: string;
    }): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        auth: string;
        userAgent: string | null;
        endpoint: string;
        p256dh: string;
        lastUsedAt: Date;
    }>;
    sendPush(userId: string, title: string, body: string, data?: any): Promise<{
        type: string;
        title: string;
        id: string;
        userId: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        body: string;
        readAt: Date | null;
        sentAt: Date;
    }>;
}
//# sourceMappingURL=notification.service.d.ts.map