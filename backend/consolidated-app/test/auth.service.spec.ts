import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';
import { OtpService } from '../src/otp/otp.service';
import { PrismaService } from '../src/prisma/prisma.module';

function makePrismaMock() {
  return {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    otpCode: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof makePrismaMock>;
  let jwt: { sign: jest.Mock; verify: jest.Mock };

  const userRow = {
    id: 'user-1',
    email: 'chioma@example.com',
    phone: null,
    emailHash: 'hash',
    phoneHash: null,
    passwordHash: '$2b$10$hashedpassword',
    status: 'active',
    role: 'user',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = makePrismaMock();
    jwt = {
      sign: jest.fn(() => 'signed-token'),
      verify: jest.fn(),
    };
    const otp = { send: jest.fn(), verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: { get: jest.fn(() => 'test-secret') } },
        { provide: JwtService, useValue: jwt },
        { provide: OtpService, useValue: otp },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('creates a user with a hashed password and returns a token pair', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockImplementation(async ({ data }) => ({ id: 'user-1', ...data }));

      const result = await service.signup({ email: 'chioma@example.com', password: 'password123' });

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      const createCall = prisma.user.create.mock.calls[0][0].data;
      expect(createCall.passwordHash).toBeDefined();
      expect(createCall.passwordHash).not.toBe('password123');
      expect(await bcrypt.compare('password123', createCall.passwordHash)).toBe(true);
      expect(result.accessToken).toBe('signed-token');
      expect(result.refreshToken).toBe('signed-token');
      expect(result.isNewUser).toBe(true);
    });

    it('rejects duplicate email', async () => {
      prisma.user.findFirst.mockResolvedValue(userRow);
      await expect(service.signup({ email: 'chioma@example.com', password: 'password123' })).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('rejects signup without email or phone', async () => {
      await expect(service.signup({ password: 'password123' })).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    it('rejects a wrong password', async () => {
      prisma.user.findFirst.mockResolvedValue({
        ...userRow,
        passwordHash: await bcrypt.hash('correct-password', 4),
      });
      await expect(service.login({ identifier: 'chioma@example.com', password: 'wrong-password' })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('returns tokens for correct credentials', async () => {
      prisma.user.findFirst.mockResolvedValue({
        ...userRow,
        passwordHash: await bcrypt.hash('correct-password', 4),
      });
      const result = await service.login({ identifier: 'chioma@example.com', password: 'correct-password' });
      expect(result.accessToken).toBe('signed-token');
      expect(result.isNewUser).toBe(false);
    });
  });

  describe('refresh', () => {
    it('rotates the refresh token and revokes the old jti', async () => {
      jwt.verify.mockReturnValue({ sub: 'user-1', role: 'user', status: 'active', jti: 'jti-old' });
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        userId: 'user-1',
        jti: 'jti-old',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: null,
      });
      prisma.user.findUnique.mockResolvedValue(userRow);
      prisma.refreshToken.create.mockResolvedValue({ id: 'rt-2' });
      prisma.refreshToken.update.mockResolvedValue({});

      const result = await service.refresh({ refreshToken: 'old-token' });

      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rt-1' },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        }),
      );
      expect(prisma.refreshToken.create).toHaveBeenCalledTimes(1);
      expect(result.accessToken).toBe('signed-token');
    });

    it('rejects a revoked refresh token', async () => {
      jwt.verify.mockReturnValue({ sub: 'user-1', role: 'user', status: 'active', jti: 'jti-revoked' });
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        userId: 'user-1',
        jti: 'jti-revoked',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: new Date(),
      });
      await expect(service.refresh({ refreshToken: 'revoked-token' })).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('revokes the refresh token for the user', async () => {
      jwt.verify.mockReturnValue({ sub: 'user-1', role: 'user', status: 'active', jti: 'jti-logout' });
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.logout('user-1', { refreshToken: 'token' });
      expect(result).toEqual({ success: true });
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { jti: 'jti-logout', userId: 'user-1' },
        }),
      );
    });
  });
});
