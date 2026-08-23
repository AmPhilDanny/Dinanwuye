import 'reflect-metadata';
import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(page?: number, limit?: number, entity?: string, adminId?: string): Promise<{
        auditLogs: any;
        total: any;
    }>;
    findByEntity(entity: string, entityId: string): Promise<any>;
    findByAdmin(adminId: string, page?: number, limit?: number): Promise<{
        auditLogs: any;
        total: any;
    }>;
}
//# sourceMappingURL=audit.controller.d.ts.map