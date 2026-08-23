import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile } from '../../common/types';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [profiles, total] = await this.prisma.$queryRaw<Profile[]>`
      SELECT id, userId, name, dob, gender, seeking, isVerified, isActive, isPremium, lastActiveAt, onboardingStep, onboardingComplete, createdAt, updatedAt
      FROM "Profile"
      ORDER BY createdAt DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
    const totalCount = await this.prisma.profile.count();
    return { profiles, total: totalCount };
  }

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async create(createProfileDto: {
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
  }) {
    const profile = await this.prisma.profile.create({
      data: createProfileDto,
    });
    return profile;
  }

  async update(id: string, updateProfileDto: {
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
  }) {
    const profile = await this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
    return profile;
  }

  async remove(id: string) {
    await this.prisma.profile.delete({
      where: { id },
    });
    return { message: `Profile ${id} deleted successfully` };
  }
}