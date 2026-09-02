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
exports.UserManagementDto = exports.AdminUpdateUserProfileDto = exports.UpdateUserStatusDto = exports.ModeratePhotoDto = exports.AdminResponseDto = exports.AdminLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AdminLoginDto {
    email;
    password;
}
exports.AdminLoginDto = AdminLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@dinanwuye.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin-password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "password", void 0);
class AdminResponseDto {
    id;
    email;
    name;
    role;
    permissions;
}
exports.AdminResponseDto = AdminResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@dinanwuye.com' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin User' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'super_admin' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], AdminResponseDto.prototype, "permissions", void 0);
class ModeratePhotoDto {
    status;
    reason;
}
exports.ModeratePhotoDto = ModeratePhotoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['approved', 'rejected', 'flagged', 'pending'] }),
    (0, class_validator_1.IsEnum)(['approved', 'rejected', 'flagged', 'pending']),
    __metadata("design:type", String)
], ModeratePhotoDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Photo does not meet community guidelines' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], ModeratePhotoDto.prototype, "reason", void 0);
class UpdateUserStatusDto {
    status;
    reason;
    expiresAt;
}
exports.UpdateUserStatusDto = UpdateUserStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['active', 'suspended', 'banned', 'deleted'] }),
    (0, class_validator_1.IsEnum)(['active', 'suspended', 'banned', 'deleted']),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Violated terms of service' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-12-31T00:00:00.000Z', description: 'Optional expiry for suspension/ban' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "expiresAt", void 0);
class AdminUpdateUserProfileDto {
    name;
    gender;
    bio;
    ethnicity;
    religion;
    occupation;
    locationName;
    isVerified;
    isActive;
    isPremium;
}
exports.AdminUpdateUserProfileDto = AdminUpdateUserProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Chinelo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], AdminUpdateUserProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'female', enum: ['male', 'female', 'non_binary'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminUpdateUserProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Love good food and long walks...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], AdminUpdateUserProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Igbo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], AdminUpdateUserProfileDto.prototype, "ethnicity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Christian' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], AdminUpdateUserProfileDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Engineer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], AdminUpdateUserProfileDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lagos, Nigeria' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], AdminUpdateUserProfileDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminUpdateUserProfileDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminUpdateUserProfileDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminUpdateUserProfileDto.prototype, "isPremium", void 0);
class UserManagementDto {
    id;
    email;
    phone;
    status;
    role;
    isVerified;
    createdAt;
    updatedAt;
    photo;
    profile;
}
exports.UserManagementDto = UserManagementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], UserManagementDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    __metadata("design:type", Object)
], UserManagementDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+2348012345678' }),
    __metadata("design:type", Object)
], UserManagementDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active' }),
    __metadata("design:type", String)
], UserManagementDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user' }),
    __metadata("design:type", String)
], UserManagementDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserManagementDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", Date)
], UserManagementDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", Date)
], UserManagementDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], UserManagementDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], UserManagementDto.prototype, "profile", void 0);
//# sourceMappingURL=admin.dto.js.map