import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Swipe } from '../../common/types';

@Injectable()
export class SwipesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [swipes, total] = await this.prisma.$queryRaw<Swipe[]>`
      SELECT id, "actorId" as "actorId", "targetId" as "targetId", action, "createdAt"
      FROM "Swipe"
      ORDER BY "createdAt" DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
    const totalCount = await this.prisma.swipe.count();
    return { swipes, total: totalCount };
  }

  async findOne(id: string) {
    const swipe = await this.prisma.swipe.findUnique({
      where: { id },
    });
    if (!swipe) {
      throw new NotFoundException(`Swipe with ID ${id} not found`);
    }
    return swipe;
  }

  async remove(id: string) {
    await this.prisma.swipe.delete({
      where: { id },
    });
    return { message: `Swipe ${id} deleted successfully` };
  }
}