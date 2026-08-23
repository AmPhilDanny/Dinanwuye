import 'reflect-metadata';
import { PrismaService } from '../prisma/prisma.service';
export declare class AdminsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        admins: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    create(createAdminDto: {
        email: string;
        name: string;
        passwordHash: string;
        role?: string;
        permissions?: string[];
    }): Promise<any>;
    update(id: string, updateAdminDto: {
        email?: string;
        name?: string;
        role?: string;
        isActive?: boolean;
        permissions?: string[];
    }): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=admins.service.d.ts.map