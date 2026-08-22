import type { JwtRequest } from '@dinanwuye/shared';
import { ProfileService } from './profile.service';
import { PhotosService } from './photos.service';
import { PreferencesService } from './preferences.service';
import { CandidateDto, CreatePhotoDto, PhotoDto, PreferencesDto, ProfileResponseDto, UpdatePreferencesDto, UpdateProfileDto } from './dto/profile.dto';
export declare class ProfileController {
    private readonly profiles;
    private readonly photos;
    private readonly preferences;
    constructor(profiles: ProfileService, photos: PhotosService, preferences: PreferencesService);
    getMe(request: JwtRequest): Promise<ProfileResponseDto>;
    updateMe(request: JwtRequest, dto: UpdateProfileDto): Promise<ProfileResponseDto>;
    getCandidates(request: JwtRequest): Promise<CandidateDto[]>;
    getPublic(id: string): Promise<ProfileResponseDto>;
    listPhotos(request: JwtRequest): Promise<PhotoDto[]>;
    addPhoto(request: JwtRequest, dto: CreatePhotoDto): Promise<PhotoDto>;
    removePhoto(request: JwtRequest, photoId: string): Promise<{
        success: true;
    }>;
    getPreferences(request: JwtRequest): Promise<PreferencesDto>;
    updatePreferences(request: JwtRequest, dto: UpdatePreferencesDto): Promise<PreferencesDto>;
}
//# sourceMappingURL=profile.controller.d.ts.map