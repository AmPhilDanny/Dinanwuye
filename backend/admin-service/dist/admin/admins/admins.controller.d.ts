import 'reflect-metadata';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    findAll(page?: number, limit?: number): Promise<{
        admins: import("../../common/types").AdminUser;
        total: any;
    }>;
    findOne(id: string): Promise<import("../../common/types").AdminUser>;
    create(createAdminDto: CreateAdminDto): Promise<{
        inserted: boolean;
    }>;
    update(id: string, updateAdminDto: UpdateAdminDto): Promise<{
        updated: boolean;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
//# sourceMappingURL=admins.controller.d.ts.map