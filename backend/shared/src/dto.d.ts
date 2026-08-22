import { UserStatus } from './constants';
export declare class HealthResponseDto {
    status: 'healthy' | 'degraded';
    service: string;
    timestamp?: string;
    version?: string;
}
export declare class PaginatedDto<T> {
    items: T[];
    nextCursor?: string;
    hasMore: boolean;
}
export declare class ApiErrorDto {
    statusCode: number;
    message: string | string[];
    error?: string;
}
export declare class UserPublicDto {
    id: string;
    firstName: string;
    lastName?: string;
    age: number;
    locationName?: string;
    bio?: string;
    photos: string[];
    isVerified: boolean;
    isPremium: boolean;
    status: UserStatus;
}
//# sourceMappingURL=dto.d.ts.map