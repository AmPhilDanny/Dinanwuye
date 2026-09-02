import type { JwtRequest } from '../shared';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminResponseDto, AdminUpdateUserProfileDto, ModeratePhotoDto, UpdateUserStatusDto, UserManagementDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly admin;
    constructor(admin: AdminService);
    login(dto: AdminLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(request: JwtRequest): Promise<AdminResponseDto>;
    getDashboardStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        totalProfiles: number;
        pendingPhotos: number;
        totalMatches: number;
        totalReports: number;
        pendingReports: number;
    }>;
    getUsers(page?: number, limit?: number, search?: string): Promise<{
        users: UserManagementDto[];
        total: number;
    }>;
    getUser(id: string): Promise<UserManagementDto>;
    updateUserStatus(id: string, dto: UpdateUserStatusDto, request: JwtRequest): Promise<{
        success: true;
    }>;
    updateUserProfile(id: string, dto: AdminUpdateUserProfileDto, request: JwtRequest): Promise<{
        success: true;
    }>;
    getReports(page?: number, limit?: number): Promise<{
        reports: any[];
        total: number;
    }>;
    getProfiles(page?: number, limit?: number): Promise<{
        profiles: any[];
        total: number;
    }>;
    getPhotos(page?: number, limit?: number): Promise<{
        photos: any[];
        total: number;
    }>;
    updatePhotoModeration(id: string, dto: ModeratePhotoDto, request: JwtRequest): Promise<{
        id: string;
        moderationStatus: string;
        moderationReason: string | null;
    }>;
    getMatches(page?: number, limit?: number): Promise<{
        matches: any[];
        total: number;
    }>;
    getAudit(page?: number, limit?: number): Promise<{
        entries: any[];
        total: number;
    }>;
}
//# sourceMappingURL=admin.controller.d.ts.map