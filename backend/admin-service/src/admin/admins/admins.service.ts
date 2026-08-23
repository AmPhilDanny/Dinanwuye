import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [admins, total] = await this.prisma.$queryRaw<AdminUser[]>`
      SELECT id, email, name, role, isActive, lastLoginAt, createdAt
      FROM "AdminUser"
      ORDER BY createdAt DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
    const totalCount = await this.prisma.adminUser.count();
    return { admins, total: totalCount };
  }

  async findOne(id: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    const { passwordHash, ...result } = admin;
    return result;
  }

  async create(createAdminDto: { email: string; name: string; passwordHash: string; role?: string; permissions?: string[] }) {
    const admin = await this.prisma.adminUser.create({
      data: {
        email: createAdminDto.email,
        name: createAdminDto.name,
        passwordHash: createAdminDto.passwordHash,
        role: createAdminDto.role || 'admin',
        isActive: true,
        permissions: createAdminDto.permissions || [],
      },
    });
    const { passwordHash, ...result } = admin;
    return result;
  }

  async update(id: string, updateAdminDto: { email?: string; name?: string; role?: string; isActive?: boolean; permissions?: string[] }) {
    const admin = await this.prisma.adminUser.update({
      where: { id },
      data: updateAdminDto,
    });
    const { passwordHash, ...result } = admin;
    return result;
  }

  async remove(id: string) {
    await this.prisma.adminUser.delete({
      where: { id },
    });
    return { message: `Admin ${id} deleted successfully` };
  }
}