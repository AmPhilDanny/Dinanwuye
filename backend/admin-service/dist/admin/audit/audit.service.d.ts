import 'reflect-metadata';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLog } from '../../common/types';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, entity?: string, adminId?: string): Promise<{
        auditLogs: AuditLog;
        total: number;
    }>;
    findByEntity(entity: string, entityId: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        adminId: string;
        entity: string;
        entityId: string | null;
        oldData: import("@prisma/client/runtime/library").JsonValue | null;
        newData: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    findByAdmin(adminId: string, page?: number, limit?: number): Promise<{
        auditLogs: AuditLog;
        total: number;
    }>;
}
//# sourceMappingURL=audit.service.d.ts.map