import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PhotosModule } from './photos/photos.module';
import { MatchesModule } from './matches/matches.module';
import { SwipesModule } from './swipes/swipes.module';
import { AuditModule } from './audit/audit.module';
import { AdminsModule } from './admins/admins.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dinanwuye-admin-secret',
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtAuthGuard,
    UsersModule,
    ProfilesModule,
    PhotosModule,
    MatchesModule,
    SwipesModule,
    AuditModule,
    AdminsModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}