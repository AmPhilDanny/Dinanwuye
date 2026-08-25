import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const admin = await this.prisma.adminUser.findUnique({ where: { email: body.email.trim().toLowerCase() } });
    if (!admin || !admin.isActive || !(await bcrypt.compare(body.password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    await this.prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    return {
      accessToken: await this.jwt.signAsync({ sub: admin.id, role: admin.role }),
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role, permissions: admin.permissions },
    };
  }
}
