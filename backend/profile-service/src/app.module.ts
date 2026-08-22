import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthController, SERVICE_NAME_TOKEN, SERVICE_VERSION_TOKEN } from '@dinanwuye/shared';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { PhotosService } from './profile/photos.service';
import { PreferencesService } from './profile/preferences.service';

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
  controllers: [HealthController, ProfileController],
  providers: [
    ProfileService,
    PhotosService,
    PreferencesService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: SERVICE_NAME_TOKEN, useValue: 'profile-service' },
    { provide: SERVICE_VERSION_TOKEN, useValue: '0.1.0' },
  ],
})
export class AppModule {}