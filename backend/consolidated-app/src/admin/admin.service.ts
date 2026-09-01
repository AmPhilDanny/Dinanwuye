import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.module';
import { AdminLoginDto, AdminResponseDto, UpdateUserStatusDto, UserManagementDto } from './dto/admin.dto';
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
    totalMatches: number;
    totalReports: number;
    pendingReports: number;
  }> {
    const [totalUsers, activeUsers, totalMatches, totalReports, pendingReports] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'active' } }),
      this.prisma.match.count(),
      this.prisma.report.count(),
      this.prisma.report.count({ where: { status: 'pending' } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalMatches,
      totalReports,
      pendingReports,
    };
  }

  async getUsers(page: number = 1, limit: number = 50): Promise<{ users: UserManagementDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { profile: true },
      }),
      this.prisma.user.count(),
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
          locationName: u.profile.locationName,
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
        locationName: user.profile.locationName,
      } : null,
    };
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto): Promise<{ success: true }> {
    await this.prisma.user.update({
      where: { id },
      data: { status: dto.status },
    });

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
