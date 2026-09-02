"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
function computeAge(dob) {
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
        age -= 1;
    }
    return age;
}
function toProfileResponse(profile) {
    const { locationLat, locationLng, ...rest } = profile;
    return {
        ...rest,
        locationGeo: typeof locationLat === 'number' && typeof locationLng === 'number' ? { lat: locationLat, lng: locationLng } : null,
    };
}
let ProfileService = class ProfileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /** Get-or-create the authenticated user's profile (lazy creation for onboarding). */
    async getOrCreateProfile(userId) {
        let profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: { photos: { orderBy: { order: 'asc' } } },
        });
        if (!profile) {
            profile = await this.prisma.profile.create({
                data: {
                    userId,
                    name: '',
                    dob: new Date('1990-01-01'),
                    gender: 'non_binary',
                    seeking: [],
                },
                include: { photos: { orderBy: { order: 'asc' } } },
            });
        }
        return toProfileResponse(profile);
    }
    async updateProfile(userId, dto) {
        const existing = await this.prisma.profile.findUnique({ where: { userId } });
        if (!existing) {
            throw new common_1.NotFoundException('Profile not found — GET /profiles/me first');
        }
        if (dto.dob) {
            const dob = new Date(dto.dob);
            if (Number.isNaN(dob.getTime())) {
                throw new common_1.BadRequestException('Invalid birthdate');
            }
            if (computeAge(dob) < 18) {
                throw new common_1.BadRequestException('You must be at least 18 years old to use Dinanwuye');
            }
        }
        const { dob, locationLat, locationLng, ...rest } = dto;
        const updated = await this.prisma.profile.update({
            where: { userId },
            data: {
                ...rest,
                ...(dob ? { dob: new Date(dob) } : {}),
                ...(locationLat !== undefined ? { locationLat } : {}),
                ...(locationLng !== undefined ? { locationLng } : {}),
                lastActiveAt: new Date(),
            },
        });
        return toProfileResponse(updated);
    }
    /** Public profile by id (any authenticated or unauthenticated caller). */
    async getPublicProfile(profileId) {
        const profile = await this.prisma.profile.findFirst({
            where: { OR: [{ id: profileId }, { userId: profileId }] },
            include: { photos: { where: { moderationStatus: 'approved' }, orderBy: { order: 'asc' } } },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return {
            id: profile.id,
            userId: profile.userId,
            name: profile.name,
            age: computeAge(profile.dob),
            gender: profile.gender,
            bio: profile.bio,
            interests: profile.interests,
            locationName: profile.locationName,
            isVerified: profile.isVerified,
            photos: profile.photos.map((photo) => ({
                id: photo.id,
                s3Key: photo.s3Key,
                order: photo.order,
                moderationStatus: photo.moderationStatus,
            })),
        };
    }
    /** Candidate list for the matching service (basic filters only; matching ranks). */
    async getCandidates(userId) {
        const requester = await this.prisma.profile.findUnique({ where: { userId } });
        const requesterAgePrefs = await this.prisma.preference.findUnique({
            where: { profileId: requester?.id ?? '' },
        });
        const candidates = await this.prisma.profile.findMany({
            where: {
                userId: { not: userId },
                isActive: true,
                onboardingComplete: true,
                ...(requester?.gender ? { seeking: { has: requester.gender } } : {}),
            },
            include: { photos: { where: { moderationStatus: 'approved' }, orderBy: { order: 'asc' }, take: 1 } },
            take: 200,
        });
        return candidates
            .filter((c) => {
            const age = computeAge(c.dob);
            const ageMin = requesterAgePrefs?.ageMin ?? 21;
            const ageMax = requesterAgePrefs?.ageMax ?? 45;
            return age >= ageMin && age <= ageMax;
        })
            .map((c) => ({
            id: c.id,
            userId: c.userId,
            name: c.name,
            photo: c.photos?.[0]?.s3Key || null,
            age: computeAge(c.dob),
            gender: c.gender,
            seeking: c.seeking,
            interests: c.interests,
            locationGeo: typeof c.locationLat === 'number' && typeof c.locationLng === 'number'
                ? { lat: c.locationLat, lng: c.locationLng }
                : null,
            locationName: c.locationName,
            lastActiveAt: c.lastActiveAt,
            isVerified: c.isVerified,
            isPremium: c.isPremium,
        }));
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map