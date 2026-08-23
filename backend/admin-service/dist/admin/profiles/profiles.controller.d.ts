import 'reflect-metadata';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    findAll(page?: number, limit?: number): Promise<{
        profiles: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    create(createProfileDto: CreateProfileDto): Promise<any>;
    update(id: string, updateProfileDto: UpdateProfileDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=profiles.controller.d.ts.map