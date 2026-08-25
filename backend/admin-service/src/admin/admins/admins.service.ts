import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminUser } from '../../common/types';

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
    const totalCount = await this.prisma.$executeRaw`SELECT COUNT(*) FROM "AdminUser"`;
    return { admins, total: (total as any) || 0 };
  }

  async findOne(id: string) {
    const admin = await this.prisma.$queryRaw<AdminUser[]>`
      SELECT id, email, name, role, isActive, lastLoginAt, createdAt
      FROM "AdminUser"
      WHERE id = ${id}
    `;
    if (!admin || admin.length === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin[0];
  }

  async create(createAdminDto: { email: string; name: string; passwordHash: string; role?: string; permissions?: string[] }) {
    await this.prisma.$executeRaw`INSERT INTO "AdminUser" (email, name, passwordHash, role, isActive, permissions)
      VALUES (${createAdminDto.email}, ${createAdminDto.name}, ${createAdminDto.passwordHash}, ${createAdminDto.role || 'admin'}, true, ${createAdminDto.permissions || '[]'})`;
    return { inserted: true };
  }

  async update(id: string, updateAdminDto: { email?: string; name?: string; role?: string; isActive?: boolean; permissions?: string[] }) {
    const setClause = Object.entries(updateAdminDto)
      .filter(([key]) => key in { email: true, name: true, role: true, isActive: true, permissions: true })
      .map(([key, value]) => `"${key}" = ${typeof value === 'string' ? `'${value}'` : value}`)
      .join(', ');
    
    await this.prisma.$executeRaw`UPDATE "AdminUser" SET ${setClause} WHERE id = ${id}`;
    return { updated: true };
  }

  async remove(id: string) {
    await this.prisma.$executeRaw`DELETE FROM "AdminUser" WHERE id = ${id}`;
    return { deleted: true };
  }
}