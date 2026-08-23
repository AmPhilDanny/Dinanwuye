import 'reflect-metadata';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
//# sourceMappingURL=audit.service.d.ts.map