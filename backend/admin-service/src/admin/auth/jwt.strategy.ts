import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async validate(payload: { userId: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user || !user.isActive) {
      return null;
    }
    return { userId: user.id, email: user.email, role: user.role };
  }
}