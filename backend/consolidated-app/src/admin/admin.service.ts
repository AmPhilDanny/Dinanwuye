import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.module';
import { AdminLoginDto, AdminResponseDto, AdminUpdateUserProfileDto, UpdateUserStatusDto, UserManagementDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: AdminLoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const secret = this.config.get<string>('JWT_SECRET') ?? 'insecure-dev-secret';
    const accessToken = this.jwt.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      { secret, expiresIn: '15m' },
    );

    const refreshToken = this.jwt.sign(
      { sub: admin.id, role: admin.role },
      { secret, expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async getAdmin(adminId: string): Promise<AdminResponseDto> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
    };
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalProfiles: number;
    pendingPhotos: number;
    totalMatches: number;
    totalReports: number;
    pendingReports: number;
  }> {
    const [totalUsers, activeUsers, totalProfiles, pendingPhotos, totalMatches, totalReports, pendingReports] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'active' } }),
      this.prisma.profile.count(),
      this.prisma.photo.count({ where: { moderationStatus: 'pending' } }),
      this.prisma.match.count(),
      this.prisma.report.count(),
      this.prisma.report.count({ where: { status: 'pending' } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalProfiles,
      pendingPhotos,
      totalMatches,
      totalReports,
      pendingReports,
    };
  }

  async getUsers(page: number = 1, limit: number = 50, search?: string): Promise<{ users: UserManagementDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { profile: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        where,
        include: { profile: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u: any) => ({
        id: u.id,
        email: u.email,
        phone: u.phone,
        status: u.status,
        role: u.role,
        isVerified: u.isVerified,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        profile: u.profile ? {
          name: u.profile.name,
          gender: u.profile.gender,
          bio: u.profile.bio,
          ethnicity: u.profile.ethnicity,
          religion: u.profile.religion,
          occupation: u.profile.occupation,
          locationName: u.profile.locationName,
          isVerified: u.profile.isVerified,
          isActive: u.profile.isActive,
          isPremium: u.profile.isPremium,
          interests: u.profile.interests,
          languages: u.profile.languages,
          relationshipIntent: u.profile.relationshipIntent,
          heightCm: u.profile.heightCm,
        } : null,
      })),
      total,
    };
  }

  async getUser(id: string): Promise<UserManagementDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile ? {
        name: user.profile.name,
        gender: user.profile.gender,
        bio: user.profile.bio,
        ethnicity: user.profile.ethnicity,
        religion: user.profile.religion,
        occupation: user.profile.occupation,
        locationName: user.profile.locationName,
        isVerified: user.profile.isVerified,
        isActive: user.profile.isActive,
        isPremium: user.profile.isPremium,
        interests: user.profile.interests,
        languages: user.profile.languages,
        relationshipIntent: user.profile.relationshipIntent,
        heightCm: user.profile.heightCm,
      } : null,
    };
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto, adminId?: string): Promise<{ success: true }> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const oldStatus = user.status;
    await this.prisma.user.update({
      where: { id },
      data: { status: dto.status },
    });

    if (dto.status === 'banned' || dto.status === 'suspended') {
      await this.prisma.ban.upsert({
        where: { userId: id },
        create: {
          userId: id,
          reason: dto.reason || `Status changed to ${dto.status}`,
          bannedBy: adminId || 'system',
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        },
        update: {
          reason: dto.reason || `Status changed to ${dto.status}`,
          bannedBy: adminId || 'system',
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          liftedAt: null,
        },
      });
    } else if (dto.status === 'active') {
      const ban = await this.prisma.ban.findUnique({ where: { userId: id } });
      if (ban) {
        await this.prisma.ban.update({
          where: { userId: id },
          data: { liftedAt: new Date() },
        });
      }
    }

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'update',
          entity: 'User',
          entityId: id,
          oldData: { status: oldStatus },
          newData: { status: dto.status, reason: dto.reason },
        },
      });
    }

    return { success: true };
  }

  async updateUserProfile(id: string, dto: AdminUpdateUserProfileDto, adminId?: string): Promise<{ success: true }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');

    // Update user-level fields
    if (dto.isVerified !== undefined) {
      await this.prisma.user.update({
        where: { id },
        data: { isVerified: dto.isVerified },
      });
    }

    // Update profile fields
    if (user.profile) {
      const profileData: Record<string, any> = {};
      if (dto.name !== undefined) profileData.name = dto.name;
      if (dto.gender !== undefined) profileData.gender = dto.gender;
      if (dto.bio !== undefined) profileData.bio = dto.bio;
      if (dto.ethnicity !== undefined) profileData.ethnicity = dto.ethnicity;
      if (dto.religion !== undefined) profileData.religion = dto.religion;
      if (dto.occupation !== undefined) profileData.occupation = dto.occupation;
      if (dto.locationName !== undefined) profileData.locationName = dto.locationName;
      if (dto.isActive !== undefined) profileData.isActive = dto.isActive;
      if (dto.isPremium !== undefined) profileData.isPremium = dto.isPremium;

      if (Object.keys(profileData).length > 0) {
        await this.prisma.profile.update({
          where: { userId: id },
          data: profileData,
        });
      }
    }

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'update',
          entity: 'Profile',
          entityId: id,
          oldData: {},
          newData: dto,
        },
      });
    }

    return { success: true };
  }

  async getReports(page: number = 1, limit: number = 50): Promise<{ reports: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, email: true } },
          target: { select: { id: true, email: true } },
        },
      }),
      this.prisma.report.count(),
    ]);

    return { reports, total };
  }

  async getProfiles(page: number = 1, limit: number = 50): Promise<{ profiles: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: true } }),
      this.prisma.profile.count(),
    ]);
    return { profiles, total };
  }

  async getPhotos(page: number = 1, limit: number = 50): Promise<{ photos: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const [photos, total] = await Promise.all([
      this.prisma.photo.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { profile: { include: { user: true } } } }),
      this.prisma.photo.count(),
    ]);
    return { photos, total };
  }

  async updatePhotoModeration(id: string, status: 'approved' | 'rejected' | 'flagged' | 'pending', reason?: string, adminId?: string) {
    if (!['approved', 'rejected', 'flagged', 'pending'].includes(status)) {
      throw new NotFoundException('Invalid moderation status');
    }
    const photo = await this.prisma.photo.findUnique({ where: { id }, include: { profile: { include: { user: true } } } });
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const oldStatus = photo.moderationStatus;
    const updated = await this.prisma.photo.update({
      where: { id },
      data: {
        moderationStatus: status,
        moderationReason: reason ?? null,
        moderatedAt: new Date(),
      },
    });

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'update',
          entity: 'Photo',
          entityId: id,
          oldData: { moderationStatus: oldStatus },
          newData: { moderationStatus: status, moderationReason: reason ?? null },
        },
      });
    }

    return { id: updated.id, moderationStatus: updated.moderationStatus, moderationReason: updated.moderationReason };
  }

  async getMatches(page: number = 1, limit: number = 50): Promise<{ matches: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { userA: true, userB: true } }),
      this.prisma.match.count(),
    ]);
    return { matches, total };
  }

  async getAudit(page: number = 1, limit: number = 50): Promise<{ entries: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const [entries, total] = await Promise.all([
      this.prisma.auditLog.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { admin: true } }),
      this.prisma.auditLog.count(),
    ]);
    return { entries, total };
  }
}
