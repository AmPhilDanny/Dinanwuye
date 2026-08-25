import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionGuard } from './permission.guard';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dinanwuye-admin-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [JwtStrategy, PermissionGuard],
  exports: [JwtModule, PassportModule, PermissionGuard],
})
export class AuthModule {}