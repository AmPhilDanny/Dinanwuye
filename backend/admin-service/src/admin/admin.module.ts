import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PhotosModule } from './photos/photos.module';
import { MatchesModule } from './matches/matches.module';
import { SwipesModule } from './swipes/swipes.module';
import { AuditModule } from './audit/audit.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [
    AuthModule,
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