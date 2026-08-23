import 'reflect-metadata';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        users: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    create(createUserDto: {
        email: string;
        name: string;
        passwordHash: string;
        role?: string;
    }): Promise<any>;
    update(id: string, updateUserDto: {
        email?: string;
        name?: string;
        role?: string;
        isActive?: boolean;
    }): Promise<{
        email?: string;
        name?: string;
        role?: string;
        isActive?: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map