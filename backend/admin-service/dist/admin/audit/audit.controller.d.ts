import 'reflect-metadata';
import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(page?: number, limit?: number, entity?: string, adminId?: string): Promise<{
        auditLogs: import("../../common/types").AuditLog;
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
        auditLogs: import("../../common/types").AuditLog;
        total: number;
    }>;
}
//# sourceMappingURL=audit.controller.d.ts.map