import 'reflect-metadata';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../../common/types';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        users: User;
        total: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string | null;
        passwordHash: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        emailHash: string | null;
        phoneHash: string | null;
        status: string;
        isVerified: boolean;
        deviceFingerprint: string | null;
    }>;
    create(createUserDto: {
        email: string;
        name: string;
        passwordHash: string;
        role?: string;
    }): Promise<{
        id: string;
        email: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        emailHash: string | null;
        phoneHash: string | null;
        status: string;
        isVerified: boolean;
        deviceFingerprint: string | null;
    }>;
    update(id: string, updateUserDto: {
        email?: string;
        role?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        email: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        emailHash: string | null;
        phoneHash: string | null;
        status: string;
        isVerified: boolean;
        deviceFingerprint: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map