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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicProfileDto = exports.ProfileResponseDto = exports.CandidateDto = exports.PreferencesDto = exports.UpdatePreferencesDto = exports.PhotoDto = exports.CreatePhotoDto = exports.UpdateProfileDto = exports.SEEKING_OPTIONS = exports.GENDERS = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.GENDERS = ['male', 'female', 'non_binary'];
exports.SEEKING_OPTIONS = ['men', 'women', 'everyone'];
class UpdateProfileDto {
    name;
    dob;
    gender;
    seeking;
    bio;
    heightCm;
    ethnicity;
    religion;
    relationshipIntent;
    education;
    occupation;
    languages;
    interests;
    locationLat;
    locationLng;
    locationName;
    onboardingStep;
    onboardingComplete;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Chinelo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1996-04-12' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.GENDERS, example: 'female' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(exports.GENDERS),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], enum: exports.SEEKING_OPTIONS, example: ['men'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(3),
    (0, class_validator_1.IsIn)(exports.SEEKING_OPTIONS, { each: true }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "seeking", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Love good food and long walks...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 168 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(120),
    (0, class_validator_1.Max)(230),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "heightCm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Igbo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "ethnicity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Christian' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'serious' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "relationshipIntent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BSc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Engineer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['Igbo', 'English'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['music', 'faith', 'travel'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "interests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 6.5244 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "locationLat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3.3792 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "locationLng", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lagos, Nigeria' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "onboardingStep", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProfileDto.prototype, "onboardingComplete", void 0);
class CreatePhotoDto {
    dataUrl;
    order;
}
exports.CreatePhotoDto = CreatePhotoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(12_000_000),
    __metadata("design:type", String)
], CreatePhotoDto.prototype, "dataUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePhotoDto.prototype, "order", void 0);
class PhotoDto {
    id;
    s3Key;
    order;
    moderationStatus;
}
exports.PhotoDto = PhotoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], PhotoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...' }),
    __metadata("design:type", String)
], PhotoDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], PhotoDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending' }),
    __metadata("design:type", String)
], PhotoDto.prototype, "moderationStatus", void 0);
class UpdatePreferencesDto {
    ageMin;
    ageMax;
    distanceKm;
    showOnlineStatus;
    showDistance;
    incognitoMode;
}
exports.UpdatePreferencesDto = UpdatePreferencesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 21 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "ageMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 45 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "ageMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "distanceKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "showOnlineStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "showDistance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "incognitoMode", void 0);
class PreferencesDto {
    ageMin;
    ageMax;
    distanceKm;
    showOnlineStatus;
    showDistance;
    incognitoMode;
}
exports.PreferencesDto = PreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 21 }),
    __metadata("design:type", Number)
], PreferencesDto.prototype, "ageMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45 }),
    __metadata("design:type", Number)
], PreferencesDto.prototype, "ageMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], PreferencesDto.prototype, "distanceKm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PreferencesDto.prototype, "showOnlineStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PreferencesDto.prototype, "showDistance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], PreferencesDto.prototype, "incognitoMode", void 0);
class CandidateDto {
    id;
    userId;
    age;
    gender;
    seeking;
    interests;
    locationGeo;
    locationName;
    lastActiveAt;
    isVerified;
    isPremium;
}
exports.CandidateDto = CandidateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], CandidateDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Auth service user ID used by matching and messaging' }),
    __metadata("design:type", String)
], CandidateDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 29 }),
    __metadata("design:type", Number)
], CandidateDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'female' }),
    __metadata("design:type", String)
], CandidateDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['men'] }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "seeking", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['music', 'travel'] }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "interests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { lat: 6.5244, lng: 3.3792 },
    }),
    __metadata("design:type", Object)
], CandidateDto.prototype, "locationGeo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lagos, Nigeria' }),
    __metadata("design:type", Object)
], CandidateDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", Date)
], CandidateDto.prototype, "lastActiveAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "isPremium", void 0);
class ProfileResponseDto {
    id;
    userId;
    name;
    age;
    gender;
    seeking;
    bio;
    heightCm;
    ethnicity;
    religion;
    relationshipIntent;
    education;
    occupation;
    languages;
    interests;
    locationGeo;
    locationName;
    isVerified;
    isActive;
    isPremium;
    lastActiveAt;
    onboardingStep;
    onboardingComplete;
    photos;
}
exports.ProfileResponseDto = ProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chinelo' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 29 }),
    __metadata("design:type", Number)
], ProfileResponseDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'female' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['men'] }),
    __metadata("design:type", Array)
], ProfileResponseDto.prototype, "seeking", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "heightCm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "ethnicity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "relationshipIntent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], ProfileResponseDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], ProfileResponseDto.prototype, "interests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { lat: 6.5244, lng: 3.3792 } }),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "locationGeo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ProfileResponseDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ProfileResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProfileResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ProfileResponseDto.prototype, "isPremium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", Date)
], ProfileResponseDto.prototype, "lastActiveAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], ProfileResponseDto.prototype, "onboardingStep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ProfileResponseDto.prototype, "onboardingComplete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PhotoDto] }),
    __metadata("design:type", Array)
], ProfileResponseDto.prototype, "photos", void 0);
class PublicProfileDto {
    id;
    userId;
    name;
    age;
    gender;
    bio;
    interests;
    locationName;
    isVerified;
    photos;
}
exports.PublicProfileDto = PublicProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], PublicProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], PublicProfileDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chinelo' }),
    __metadata("design:type", String)
], PublicProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 29 }),
    __metadata("design:type", Number)
], PublicProfileDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'female' }),
    __metadata("design:type", String)
], PublicProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], PublicProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], PublicProfileDto.prototype, "interests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], PublicProfileDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PublicProfileDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PhotoDto] }),
    __metadata("design:type", Array)
], PublicProfileDto.prototype, "photos", void 0);
//# sourceMappingURL=profile.dto.js.map