import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProfileService } from '../src/profile/profile.service';
import { PhotosService } from '../src/profile/photos.service';
import { PreferencesService } from '../src/profile/preferences.service';
import { PrismaService } from '../src/prisma/prisma.module';

function makePrismaMock() {
  return {
    profile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    photo: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    preference: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };
}

const profileRow = {
  id: 'p-1',
  userId: 'u-1',
  name: 'Chinelo',
  dob: new Date('1996-04-12'),
  gender: 'female',
  seeking: ['men'],
  bio: null,
  heightCm: null,
  ethnicity: null,
  religion: null,
  relationshipIntent: null,
  education: null,
  occupation: null,
  languages: ['Igbo', 'English'],
  interests: ['music', 'faith'],
  locationLat: 6.5244,
  locationLng: 3.3792,
  locationName: 'Lagos, Nigeria',
  isVerified: false,
  isActive: true,
  isPremium: false,
  lastActiveAt: new Date(),
  onboardingStep: 3,
  onboardingComplete: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProfileService', () => {
  let service: ProfileService;
  let photos: PhotosService;
  let prefs: PreferencesService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        PhotosService,
        PreferencesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ProfileService);
    photos = module.get(PhotosService);
    prefs = module.get(PreferencesService);
  });

  describe('getOrCreateProfile', () => {
    it('returns existing profile', async () => {
      prisma.profile.findUnique.mockResolvedValue(profileRow);
      const result = await service.getOrCreateProfile('u-1');
      expect(result.id).toBe('p-1');
    });

    it('lazily creates a profile on first hit', async () => {
      prisma.profile.findUnique.mockResolvedValue(null);
      prisma.profile.create.mockResolvedValue(profileRow);
      const result = await service.getOrCreateProfile('u-1');
      expect(prisma.profile.create).toHaveBeenCalledTimes(1);
      expect(result.userId).toBe('u-1');
    });
  });

  describe('updateProfile', () => {
    it('rejects underage users', async () => {
      prisma.profile.findUnique.mockResolvedValue(profileRow);
      await expect(
        service.updateProfile('u-1', { dob: '2010-01-01' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects profile update when no profile exists', async () => {
      prisma.profile.findUnique.mockResolvedValue(null);
      await expect(service.updateProfile('u-1', { bio: 'hi' })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('accepts a valid 18+ update and refreshes lastActiveAt', async () => {
      prisma.profile.findUnique.mockResolvedValue(profileRow);
      prisma.profile.update.mockImplementation(async ({ data }) => ({ ...profileRow, ...data }));
      const result = await service.updateProfile('u-1', { dob: '1996-04-12', bio: 'new bio' });
      expect(result.bio).toBe('new bio');
      expect(prisma.profile.update.mock.calls[0][0].data.lastActiveAt).toBeInstanceOf(Date);
    });
  });

  describe('getCandidates', () => {
    it('returns candidates with computed age, filtered by preference range', async () => {
      prisma.profile.findUnique.mockResolvedValue(profileRow);
      prisma.preference.findUnique.mockResolvedValue({ ageMin: 25, ageMax: 35 });
      prisma.profile.findMany.mockResolvedValue([
        profileRow,
        { ...profileRow, id: 'p-2', dob: new Date('2000-01-01') }, // age 26 in range
        { ...profileRow, id: 'p-3', dob: new Date('1960-01-01') }, // age 66 out of range
      ]);

      const result = await service.getCandidates('u-1');
      expect(result).toHaveLength(2);
      expect(result[0].age).toBeGreaterThanOrEqual(25);
    });
  });
});
