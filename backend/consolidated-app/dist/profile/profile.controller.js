"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("../shared");
const profile_service_1 = require("./profile.service");
const photos_service_1 = require("./photos.service");
const preferences_service_1 = require("./preferences.service");
const profile_dto_1 = require("./dto/profile.dto");
let ProfileController = class ProfileController {
    profiles;
    photos;
    preferences;
    constructor(profiles, photos, preferences) {
        this.profiles = profiles;
        this.photos = photos;
        this.preferences = preferences;
    }
    getMe(request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.profiles.getOrCreateProfile(sub);
    }
    updateMe(request, dto) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.profiles.updateProfile(sub, dto);
    }
    getCandidates(request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.profiles.getCandidates(sub);
    }
    listPhotos(request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.photos.listPhotos(sub);
    }
    addPhoto(request, file) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.photos.addPhoto(sub, file);
    }
    removePhoto(request, photoId) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.photos.removePhoto(sub, photoId);
    }
    getPreferences(request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.preferences.getPreferences(sub);
    }
    updatePreferences(request, dto) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.preferences.updatePreferences(sub, dto);
    }
    getPublic(id) {
        return this.profiles.getPublicProfile(id);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get (or lazily create) my profile' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update my profile (partial)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('candidates'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Candidate profiles for the matching service (basic filters)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getCandidates", null);
__decorate([
    (0, common_1.Get)('me/photos'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List my photos' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "listPhotos", null);
__decorate([
    (0, common_1.Post)('me/photos'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a profile photo (jpeg/png/webp, max 10 MB)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Delete)('me/photos/:photoId'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a photo' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "removePhoto", null);
__decorate([
    (0, common_1.Get)('me/preferences'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my matching preferences' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Patch)('me/preferences'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update my matching preferences' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profile_dto_1.UpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Public profile by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getPublic", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('profiles'),
    (0, common_1.Controller)('profiles'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService,
        photos_service_1.PhotosService,
        preferences_service_1.PreferencesService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map