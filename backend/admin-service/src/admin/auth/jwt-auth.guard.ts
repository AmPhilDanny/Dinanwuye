import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: import('@nestjs/common').ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    try {
      const payload = await this.prisma.$executeRaw`SELECT 1`; // Placeholder - actual JWT verification would use a library
      request.user = { userId: 'decoded-user', role: 'user' };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}