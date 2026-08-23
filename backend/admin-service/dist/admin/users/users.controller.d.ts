import 'reflect-metadata';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page: number | undefined, limit: number | undefined, req: any): Promise<{
        users: any;
        total: any;
    }>;
    findOne(id: string, req: any): Promise<any>;
    create(createUserDto: CreateUserDto, req: any): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
        email?: string;
        name?: string;
        role?: string;
        isActive?: boolean;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map