import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { UpdateProfileDto, ProfileResponseDto, CandidateDto, PublicProfileDto } from './dto/profile.dto';

function computeAge(dob: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

function toProfileResponse(profile: Record<string, unknown> & { photos?: unknown[] }): ProfileResponseDto {
  const { locationLat, locationLng, ...rest } = profile;
  return {
    ...rest,
    locationGeo:
      typeof locationLat === 'number' && typeof locationLng === 'number' ? { lat: locationLat, lng: locationLng } : null,
  } as unknown as ProfileResponseDto;
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get-or-create the authenticated user's profile (lazy creation for onboarding). */
  async getOrCreateProfile(userId: string): Promise<ProfileResponseDto> {
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

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const existing = await this.prisma.profile.findUnique({ where: { userId } });
    if (!existing) {
      throw new NotFoundException('Profile not found — GET /profiles/me first');
    }

    if (dto.dob) {
      const dob = new Date(dto.dob);
      if (Number.isNaN(dob.getTime())) {
        throw new BadRequestException('Invalid birthdate');
      }
      if (computeAge(dob) < 18) {
        throw new BadRequestException('You must be at least 18 years old to use Dinanwuye');
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
  async getPublicProfile(profileId: string): Promise<PublicProfileDto> {
    const profile = await this.prisma.profile.findFirst({
      where: { OR: [{ id: profileId }, { userId: profileId }] },
      include: { photos: { where: { moderationStatus: 'approved' }, orderBy: { order: 'asc' } } },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
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
      photos: profile.photos.map((photo: any) => ({
        id: photo.id,
        s3Key: photo.s3Key,
        order: photo.order,
        moderationStatus: photo.moderationStatus,
      })),
    };
  }

  /** Candidate list for the matching service (basic filters only; matching ranks). */
  async getCandidates(userId: string): Promise<CandidateDto[]> {
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
      .filter((c: any) => {
        const age = computeAge(c.dob);
        const ageMin = requesterAgePrefs?.ageMin ?? 21;
        const ageMax = requesterAgePrefs?.ageMax ?? 45;
        return age >= ageMin && age <= ageMax;
      })
      .map((c: any) => ({
        id: c.id,
        userId: c.userId,
        name: c.name,
        photo: c.photos?.[0]?.s3Key || null,
        age: computeAge(c.dob),
        gender: c.gender,
        seeking: c.seeking,
        interests: c.interests,
        locationGeo:
          typeof c.locationLat === 'number' && typeof c.locationLng === 'number'
            ? { lat: c.locationLat, lng: c.locationLng }
            : null,
        locationName: c.locationName,
        lastActiveAt: c.lastActiveAt,
        isVerified: c.isVerified,
        isPremium: c.isPremium,
      }));
  }
}
