import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, HttpException, NotFoundException } from '@nestjs/common';
import { SafetyService } from '../src/trust-safety/safety.service';
import { PrismaService } from '../src/prisma/prisma.module';

function makePrismaMock() {
  return {
    block: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    report: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    ban: {
      findUnique: jest.fn(),
    },
  };
}

describe('SafetyService', () => {
  let service: SafetyService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [SafetyService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(SafetyService);
  });

  describe('block', () => {
    it('creates a block row', async () => {
      prisma.block.findUnique.mockResolvedValue(null);
      prisma.block.create.mockResolvedValue({ id: 'b-1' });
      const result = await service.block('u-1', { targetId: 'u-2' });
      expect(result).toEqual({ success: true, blockedId: 'u-2' });
      expect(prisma.block.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ blockerId: 'u-1', blockedId: 'u-2' }),
        }),
      );
    });

    it('rejects duplicate blocks', async () => {
      prisma.block.findUnique.mockResolvedValue({ id: 'b-1' });
      await expect(service.block('u-1', { targetId: 'u-2' })).rejects.toBeInstanceOf(ConflictException);
    });

    it('rejects blocking yourself', async () => {
      await expect(service.block('u-1', { targetId: 'u-1' })).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('unblock', () => {
    it('unblocks idempotently when the block exists', async () => {
      prisma.block.findUnique.mockResolvedValue({ id: 'b-1' });
      prisma.block.delete.mockResolvedValue({});
      const result = await service.unblock('u-1', 'u-2');
      expect(result).toEqual({ success: true });
    });

    it('404 when no block exists', async () => {
      prisma.block.findUnique.mockResolvedValue(null);
      await expect(service.unblock('u-1', 'u-2')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('report', () => {
    it('creates a report with a valid category', async () => {
      prisma.report.count.mockResolvedValue(0);
      prisma.report.create.mockResolvedValue({
        id: 'r-1',
        reporterId: 'u-1',
        targetId: 'u-2',
        category: 'harassment',
        details: 'bad behavior',
        status: 'pending',
        createdAt: new Date(),
      });
      const result = await service.report('u-1', { targetId: 'u-2', category: 'harassment' });
      expect(result.category).toBe('harassment');
    });

    it('rejects an invalid category', async () => {
      await expect(
        service.report('u-1', { targetId: 'u-2', category: 'not-a-category' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('enforces the 3/day report limit', async () => {
      prisma.report.count.mockResolvedValue(3);
      await expect(
        service.report('u-1', { targetId: 'u-2', category: 'scam' }),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('getExclusions', () => {
    it('returns the exact { blockedBy, blocking } contract shape', async () => {
      prisma.block.findMany
        .mockResolvedValueOnce([{ blockedId: 'u-2' }, { blockedId: 'u-3' }]) // I blocked
        .mockResolvedValueOnce([{ blockerId: 'u-4' }]); // blocked me
      const result = await service.getExclusions('u-1');
      expect(result).toEqual({ blockedBy: ['u-4'], blocking: ['u-2', 'u-3'] });
    });
  });
});
