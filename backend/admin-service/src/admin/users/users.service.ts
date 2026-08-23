import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.prisma.$queryRaw<User[]>`
      SELECT id, email, phone, status, role, isVerified, createdAt, updatedAt
      FROM "AdminUser"
      ORDER BY createdAt DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
    const totalCount = await this.prisma.adminUser.count();
    return { users, total: totalCount };
  }

  async findOne(id: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: { email: string; name: string; passwordHash: string; role?: string }) {
    const user = await this.prisma.adminUser.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        passwordHash: createUserDto.passwordHash,
        role: createUserDto.role || 'admin',
        isActive: true,
      },
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: { email?: string; name?: string; role?: string; isActive?: boolean }) {
    const user = await this.prisma.adminUser.update({
      where: { id },
      data: updateUserDto,
    });
    const { passwordHash, ...result } = updateUserDto;
    return result;
  }

  async remove(id: string) {
    await this.prisma.adminUser.delete({
      where: { id },
    });
    return { message: `User ${id} deleted successfully` };
  }