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
exports.UserPublicDto = exports.ApiErrorDto = exports.PaginatedDto = exports.HealthResponseDto = void 0;
/**
 * @dinanwuye/shared — API DTOs shared across services.
 */
const swagger_1 = require("@nestjs/swagger");
class HealthResponseDto {
    status;
    service;
    timestamp;
    version;
}
exports.HealthResponseDto = HealthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'healthy' }),
    __metadata("design:type", String)
], HealthResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'auth-service' }),
    __metadata("design:type", String)
], HealthResponseDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", String)
], HealthResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.0.0' }),
    __metadata("design:type", String)
], HealthResponseDto.prototype, "version", void 0);
class PaginatedDto {
    items;
    nextCursor;
    hasMore;
}
exports.PaginatedDto = PaginatedDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], PaginatedDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cursor-string' }),
    __metadata("design:type", String)
], PaginatedDto.prototype, "nextCursor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PaginatedDto.prototype, "hasMore", void 0);
class ApiErrorDto {
    statusCode;
    message;
    error;
}
exports.ApiErrorDto = ApiErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400 }),
    __metadata("design:type", Number)
], ApiErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Validation failed' }),
    __metadata("design:type", Object)
], ApiErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BAD_REQUEST' }),
    __metadata("design:type", String)
], ApiErrorDto.prototype, "error", void 0);
class UserPublicDto {
    id;
    firstName;
    lastName;
    age;
    locationName;
    bio;
    photos;
    isVerified;
    isPremium;
    status;
}
exports.UserPublicDto = UserPublicDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], UserPublicDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chinelo' }),
    __metadata("design:type", String)
], UserPublicDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserPublicDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 29 }),
    __metadata("design:type", Number)
], UserPublicDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lagos, Nigeria' }),
    __metadata("design:type", String)
], UserPublicDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserPublicDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], UserPublicDto.prototype, "photos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], UserPublicDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], UserPublicDto.prototype, "isPremium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active' }),
    __metadata("design:type", String)
], UserPublicDto.prototype, "status", void 0);
//# sourceMappingURL=dto.js.map