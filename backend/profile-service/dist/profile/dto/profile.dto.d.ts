export declare const GENDERS: readonly ["male", "female", "non_binary"];
export declare const SEEKING_OPTIONS: readonly ["men", "women", "everyone"];
export declare class UpdateProfileDto {
    name?: string;
    dob?: string;
    gender?: string;
    seeking?: string[];
    bio?: string;
    heightCm?: number;
    ethnicity?: string;
    religion?: string;
    relationshipIntent?: string;
    education?: string;
    occupation?: string;
    languages?: string[];
    interests?: string[];
    locationLat?: number;
    locationLng?: number;
    locationName?: string;
    onboardingStep?: number;
    onboardingComplete?: boolean;
}
export declare class CreatePhotoDto {
    s3Key: string;
    order?: number;
}
export declare class PhotoDto {
    id: string;
    s3Key: string;
    order: number;
    moderationStatus: string;
}
export declare class UpdatePreferencesDto {
    ageMin?: number;
    ageMax?: number;
    distanceKm?: number;
    showOnlineStatus?: boolean;
    showDistance?: boolean;
    incognitoMode?: boolean;
}
export declare class PreferencesDto {
    ageMin: number;
    ageMax: number;
    distanceKm: number;
    showOnlineStatus: boolean;
    showDistance: boolean;
    incognitoMode: boolean;
}
export declare class CandidateDto {
    id: string;
    age: number;
    gender: string;
    seeking: string[];
    interests: string[];
    locationGeo?: {
        lat: number;
        lng: number;
    } | null;
    locationName?: string | null;
    lastActiveAt: Date;
    isVerified: boolean;
    isPremium: boolean;
}
export declare class ProfileResponseDto {
    id: string;
    userId: string;
    name: string;
    age: number;
    gender: string;
    seeking: string[];
    bio?: string | null;
    heightCm?: number | null;
    ethnicity?: string | null;
    religion?: string | null;
    relationshipIntent?: string | null;
    education?: string | null;
    occupation?: string | null;
    languages: string[];
    interests: string[];
    locationGeo?: {
        lat: number;
        lng: number;
    } | null;
    locationName?: string | null;
    isVerified: boolean;
    isActive: boolean;
    isPremium: boolean;
    lastActiveAt: Date;
    onboardingStep: number;
    onboardingComplete: boolean;
    photos: PhotoDto[];
}
//# sourceMappingURL=profile.dto.d.ts.map