import 'reflect-metadata';
import { PrismaService } from '../prisma/prisma.service';
export declare class ProfilesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        profiles: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    create(createProfileDto: {
        userId: string;
        name: string;
        dob: string;
        gender: string;
        seeking: string[];
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
    }): Promise<any>;
    update(id: string, updateProfileDto: {
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
        isVerified?: boolean;
        isActive?: boolean;
        isPremium?: boolean;
        lastActiveAt?: string;
        onboardingStep?: number;
        onboardingComplete?: boolean;
    }): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=profiles.service.d.ts.map