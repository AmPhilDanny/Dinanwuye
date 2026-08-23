import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './admin/auth/auth.module';
import { UsersModule } from './admin/users/users.module';
import { ProfilesModule } from './admin/profiles/profiles.module';
import { PhotosModule } from './admin/photos/photos.module';
import { MatchesModule } from './admin/matches/matches.module';
import { SwipesModule } from './admin/swipes/swipes.module';
import { AuditModule } from './admin/audit/audit.module';
import { AdminsModule } from './admin/admins/admins.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AdminModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    PhotosModule,
    MatchesModule,
    SwipesModule,
    AuditModule,
    AdminsModule,
  ],
})
export class AppModule {}