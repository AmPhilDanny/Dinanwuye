import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PhotosService } from './photos.service';
import { PreferencesService } from './preferences.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PhotosService, PreferencesService],
  exports: [ProfileService],
})
export class ProfileModule {}
