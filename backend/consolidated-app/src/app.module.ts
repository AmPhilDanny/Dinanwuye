import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthController, SERVICE_NAME_TOKEN, SERVICE_VERSION_TOKEN } from './shared';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { MessagingModule } from './messaging/messaging.module';
import { AdminModule } from './admin/admin.module';
import { TrustSafetyModule } from './trust-safety/trust-safety.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),

    // Rate limiting
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),

    // JWT authentication
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'insecure-dev-secret',
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    ProfileModule,
    MessagingModule,
    AdminModule,
    TrustSafetyModule,
    NotificationModule,
    PaymentModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: SERVICE_NAME_TOKEN, useValue: 'dinanwuye-api' },
    { provide: SERVICE_VERSION_TOKEN, useValue: '0.1.0' },
  ],
})
export class AppModule {}
