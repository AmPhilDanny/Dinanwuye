export declare class AdminLoginDto {
    email: string;
    password: string;
}
export declare class AdminResponseDto {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
}
export declare class ModeratePhotoDto {
    status: 'approved' | 'rejected' | 'flagged' | 'pending';
    reason?: string;
}
export declare class UpdateUserStatusDto {
    status: string;
    reason?: string;
    expiresAt?: string;
}
export declare class AdminUpdateUserProfileDto {
    name?: string;
    gender?: string;
    bio?: string;
    ethnicity?: string;
    religion?: string;
    occupation?: string;
    locationName?: string;
    isVerified?: boolean;
    isActive?: boolean;
    isPremium?: boolean;
}
export declare class UserManagementDto {
    id: string;
    email?: string | null;
    phone?: string | null;
    status: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    photo?: string | null;
    profile?: {
        name: string;
        gender: string;
        bio?: string | null;
        ethnicity?: string | null;
        religion?: string | null;
        occupation?: string | null;
        locationName?: string | null;
        isVerified: boolean;
        isActive: boolean;
        isPremium: boolean;
        interests?: string[];
        languages?: string[];
        relationshipIntent?: string | null;
        heightCm?: number | null;
    } | null;
}
//# sourceMappingURL=admin.dto.d.ts.map