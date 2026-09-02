import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.module';
import { AdminLoginDto, AdminResponseDto, AdminUpdateUserProfileDto, UpdateUserStatusDto, UserManagementDto } from './dto/admin.dto';
export declare class AdminService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    login(dto: AdminLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getAdmin(adminId: string): Promise<AdminResponseDto>;
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
    updateUserStatus(id: string, dto: UpdateUserStatusDto, adminId?: string): Promise<{
        success: true;
    }>;
    updateUserProfile(id: string, dto: AdminUpdateUserProfileDto, adminId?: string): Promise<{
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
    updatePhotoModeration(id: string, status: 'approved' | 'rejected' | 'flagged' | 'pending', reason?: string, adminId?: string): Promise<{
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
//# sourceMappingURL=admin.service.d.ts.map