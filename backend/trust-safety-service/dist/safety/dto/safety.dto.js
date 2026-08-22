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
exports.ReportResponseDto = exports.ExclusionsDto = exports.ReportQueryDto = exports.ReportDto = exports.BlockTargetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@dinanwuye/shared");
class BlockTargetDto {
    targetId;
    reason;
}
exports.BlockTargetDto = BlockTargetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-user-to-block' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 64),
    __metadata("design:type", String)
], BlockTargetDto.prototype, "targetId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'harassment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], BlockTargetDto.prototype, "reason", void 0);
class ReportDto {
    targetId;
    category;
    details;
    contextRef;
}
exports.ReportDto = ReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-user-to-report' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 64),
    __metadata("design:type", String)
], ReportDto.prototype, "targetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.REPORT_CATEGORIES, example: 'harassment' }),
    (0, class_validator_1.IsIn)(shared_1.REPORT_CATEGORIES),
    __metadata("design:type", String)
], ReportDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sent me unsolicited messages' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], ReportDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'conversation:abc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ReportDto.prototype, "contextRef", void 0);
class ReportQueryDto {
    offset;
    limit;
}
exports.ReportQueryDto = ReportQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    __metadata("design:type", Number)
], ReportQueryDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20 }),
    __metadata("design:type", Number)
], ReportQueryDto.prototype, "limit", void 0);
class ExclusionsDto {
    blockedBy;
    blocking;
}
exports.ExclusionsDto = ExclusionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['uuid-1', 'uuid-2'] }),
    __metadata("design:type", Array)
], ExclusionsDto.prototype, "blockedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['uuid-3'] }),
    __metadata("design:type", Array)
], ExclusionsDto.prototype, "blocking", void 0);
class ReportResponseDto {
    id;
    targetId;
    category;
    details;
    status;
    createdAt;
}
exports.ReportResponseDto = ReportResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-target' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "targetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'harassment' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ReportResponseDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", Date)
], ReportResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=safety.dto.js.map