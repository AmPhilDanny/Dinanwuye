import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { PreferencesDto, UpdatePreferencesDto } from './dto/profile.dto';

const DEFAULT_PREFERENCES = {
  ageMin: 21,
  ageMax: 45,
  distanceKm: 50,
  showOnlineStatus: true,
  showDistance: true,
  incognitoMode: false,
};

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get-or-create preference row with sane defaults. */
  async getPreferences(userId: string): Promise<PreferencesDto> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found — GET /profiles/me first');
    }

    const prefs = await this.prisma.preference.upsert({
      where: { profileId: profile.id },
      create: { profileId: profile.id, ...DEFAULT_PREFERENCES },
      update: {},
    });

    return {
      ageMin: prefs.ageMin,
      ageMax: prefs.ageMax,
      distanceKm: prefs.distanceKm,
      showOnlineStatus: prefs.showOnlineStatus,
      showDistance: prefs.showDistance,
      incognitoMode: prefs.incognitoMode,
    };
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto): Promise<PreferencesDto> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found — GET /profiles/me first');
    }

    const { ageMin, ageMax, ...rest } = dto;
if (ageMin !== undefined && ageMax !== undefined && ageMin > ageMax) {
      throw new BadRequestException('ageMin cannot exceed ageMax');
    }

    const prefs = await this.prisma.preference.upsert({
      where: { profileId: profile.id },
      create: { profileId: profile.id, ...DEFAULT_PREFERENCES, ...dto },
      update: { ...rest, ...(ageMin !== undefined ? { ageMin } : {}), ...(ageMax !== undefined ? { ageMax } : {}) },
    });

    return {
      ageMin: prefs.ageMin,
      ageMax: prefs.ageMax,
      distanceKm: prefs.distanceKm,
      showOnlineStatus: prefs.showOnlineStatus,
      showDistance: prefs.showDistance,
      incognitoMode: prefs.incognitoMode,
    };
  }
}
