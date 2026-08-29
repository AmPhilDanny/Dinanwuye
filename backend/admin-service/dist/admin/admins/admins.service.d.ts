import 'reflect-metadata';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminUser } from '../../common/types';
export declare class AdminsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        admins: AdminUser;
        total: any;
    }>;
    findOne(id: string): Promise<AdminUser>;
    create(createAdminDto: {
        email: string;
        name: string;
        passwordHash: string;
        role?: string;
        permissions?: string[];
    }): Promise<{
        inserted: boolean;
    }>;
    update(id: string, updateAdminDto: {
        email?: string;
        name?: string;
        role?: string;
        isActive?: boolean;
        permissions?: string[];
    }): Promise<{
        updated: boolean;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
//# sourceMappingURL=admins.service.d.ts.map