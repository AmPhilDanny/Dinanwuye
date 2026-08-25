import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../../common/types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.prisma.$queryRaw<User[]>`
      SELECT id, email, phone, status, role, isVerified, createdAt, updatedAt
      FROM "User"
      ORDER BY createdAt DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
    const totalCount = await this.prisma.user.count();
    return { users, total: totalCount };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: { email: string; name: string; passwordHash: string; role?: string }) {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: createUserDto.passwordHash,
        role: createUserDto.role || 'user',
        status: 'active',
      },
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: { email?: string; role?: string; isActive?: boolean }) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        role: updateUserDto.role,
        ...(updateUserDto.isActive === undefined ? {} : { status: updateUserDto.isActive ? 'active' : 'suspended' }),
      },
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return { message: `User ${id} deleted successfully` };
  }
}