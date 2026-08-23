import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Match } from '../../common/types';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [matches, total] = await this.prisma.$queryRaw<Match[]>`
      SELECT id, "userAId" as "userAId", "userBId" as "userBId", status, "createdAt"
      FROM "Match"
      ORDER BY "createdAt" DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
    const totalCount = await this.prisma.match.count();
    return { matches, total: totalCount };
  }

  async findOne(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  async update(id: string, updateMatchDto: { status?: string }) {
    const match = await this.prisma.match.update({
      where: { id },
      data: updateMatchDto,
    });
    return match;
  }

  async remove(id: string) {
    await this.prisma.match.delete({
      where: { id },
    });
    return { message: `Match ${id} deleted successfully` };
  }
}