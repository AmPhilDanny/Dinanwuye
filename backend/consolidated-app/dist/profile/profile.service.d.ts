import { PrismaService } from '../prisma/prisma.module';
import { UpdateProfileDto, ProfileResponseDto, CandidateDto, PublicProfileDto } from './dto/profile.dto';
export declare class ProfileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /** Get-or-create the authenticated user's profile (lazy creation for onboarding). */
    getOrCreateProfile(userId: string): Promise<ProfileResponseDto>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto>;
    /** Public profile by id (any authenticated or unauthenticated caller). */
    getPublicProfile(profileId: string): Promise<PublicProfileDto>;
    /** Candidate list for the matching service (basic filters only; matching ranks). */
    getCandidates(userId: string): Promise<CandidateDto[]>;
}
//# sourceMappingURL=profile.service.d.ts.map