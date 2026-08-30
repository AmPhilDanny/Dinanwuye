import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, getUserFromRequest } from '../shared';
import type { JwtRequest } from '../shared';
import { ProfileService } from './profile.service';
import { PhotosService } from './photos.service';
import { PreferencesService } from './preferences.service';
import {
  CandidateDto,
  CreatePhotoDto,
  PhotoDto,
  PreferencesDto,
  ProfileResponseDto,
  UpdatePreferencesDto,
  UpdateProfileDto,
  PublicProfileDto,
} from './dto/profile.dto';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly profiles: ProfileService,
    private readonly photos: PhotosService,
    private readonly preferences: PreferencesService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get (or lazily create) my profile' })
  getMe(@Req() request: JwtRequest): Promise<ProfileResponseDto> {
    const { sub } = getUserFromRequest(request);
    return this.profiles.getOrCreateProfile(sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my profile (partial)' })
  updateMe(@Req() request: JwtRequest, @Body() dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const { sub } = getUserFromRequest(request);
    return this.profiles.updateProfile(sub, dto);
  }

  @Get('candidates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Candidate profiles for the matching service (basic filters)' })
  getCandidates(@Req() request: JwtRequest): Promise<CandidateDto[]> {
    const { sub } = getUserFromRequest(request);
    return this.profiles.getCandidates(sub);
  }

  @Get('me/photos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my photos' })
  listPhotos(@Req() request: JwtRequest): Promise<PhotoDto[]> {
    const { sub } = getUserFromRequest(request);
    return this.photos.listPhotos(sub);
  }

  @Post('me/photos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a photo (V0: JSON s3Key + order, no multipart)' })
  addPhoto(@Req() request: JwtRequest, @Body() dto: CreatePhotoDto): Promise<PhotoDto> {
    const { sub } = getUserFromRequest(request);
    return this.photos.addPhoto(sub, dto);
  }

  @Delete('me/photos/:photoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a photo' })
  removePhoto(@Req() request: JwtRequest, @Param('photoId') photoId: string): Promise<{ success: true }> {
    const { sub } = getUserFromRequest(request);
    return this.photos.removePhoto(sub, photoId);
  }

  @Get('me/preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my matching preferences' })
  getPreferences(@Req() request: JwtRequest): Promise<PreferencesDto> {
    const { sub } = getUserFromRequest(request);
    return this.preferences.getPreferences(sub);
  }

  @Patch('me/preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my matching preferences' })
  updatePreferences(@Req() request: JwtRequest, @Body() dto: UpdatePreferencesDto): Promise<PreferencesDto> {
    const { sub } = getUserFromRequest(request);
    return this.preferences.updatePreferences(sub, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Public profile by id' })
  getPublic(@Param('id') id: string): Promise<PublicProfileDto> {
    return this.profiles.getPublicProfile(id);
  }
}
