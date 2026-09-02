import type { JwtRequest } from '../shared';
import { ProfileService } from './profile.service';
import { PhotosService } from './photos.service';
import { PreferencesService } from './preferences.service';
import { CandidateDto, PhotoDto, PreferencesDto, ProfileResponseDto, UpdatePreferencesDto, UpdateProfileDto, PublicProfileDto } from './dto/profile.dto';
export declare class ProfileController {
    private readonly profiles;
    private readonly photos;
    private readonly preferences;
    constructor(profiles: ProfileService, photos: PhotosService, preferences: PreferencesService);
    getMe(request: JwtRequest): Promise<ProfileResponseDto>;
    updateMe(request: JwtRequest, dto: UpdateProfileDto): Promise<ProfileResponseDto>;
    getCandidates(request: JwtRequest): Promise<CandidateDto[]>;
    listPhotos(request: JwtRequest): Promise<PhotoDto[]>;
    addPhoto(request: JwtRequest, file: any): Promise<PhotoDto>;
    removePhoto(request: JwtRequest, photoId: string): Promise<{
        success: true;
    }>;
    getPreferences(request: JwtRequest): Promise<PreferencesDto>;
    updatePreferences(request: JwtRequest, dto: UpdatePreferencesDto): Promise<PreferencesDto>;
    getPublic(id: string): Promise<PublicProfileDto>;
}
//# sourceMappingURL=profile.controller.d.ts.map