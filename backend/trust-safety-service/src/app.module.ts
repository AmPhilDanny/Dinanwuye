import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthController, SERVICE_NAME_TOKEN, SERVICE_VERSION_TOKEN } from '@dinanwuye/shared';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { SafetyController } from './safety/safety.controller';
import { SafetyService } from './safety/safety.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'insecure-dev-secret',
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
  ],
  controllers: [HealthController, SafetyController],
  providers: [
    SafetyService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: SERVICE_NAME_TOKEN, useValue: 'trust-safety-service' },
    { provide: SERVICE_VERSION_TOKEN, useValue: '0.1.0' },
  ],
})
export class AppModule {}