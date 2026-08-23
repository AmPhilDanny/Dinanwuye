import 'reflect-metadata';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    findAll(page?: number, limit?: number): Promise<{
        admins: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    create(createAdminDto: CreateAdminDto): Promise<any>;
    update(id: string, updateAdminDto: UpdateAdminDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=admins.controller.d.ts.map