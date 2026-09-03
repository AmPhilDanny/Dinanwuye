import type { JwtRequest } from '../shared';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notification;
    constructor(notification: NotificationService);
    getNotifications(request: JwtRequest): Promise<{
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
    subscribe(request: JwtRequest, body: {
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
}
//# sourceMappingURL=notification.controller.d.ts.map