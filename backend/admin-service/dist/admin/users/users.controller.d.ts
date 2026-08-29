import 'reflect-metadata';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page: number | undefined, limit: number | undefined, req: any): Promise<{
        users: import("../../common/types").User;
        total: number;
    }>;
    findOne(id: string, req: any): Promise<{
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
    create(createUserDto: CreateUserDto, req: any): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map