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
exports.SafetyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("../shared");
const common_2 = require("@nestjs/common");
const safety_service_1 = require("./safety.service");
const safety_dto_1 = require("./dto/safety.dto");
let SafetyController = class SafetyController {
    safety;
    constructor(safety) {
        this.safety = safety;
    }
    block(request, dto) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.safety.block(sub, dto);
    }
    unblock(request, targetId) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.safety.unblock(sub, targetId);
    }
    report(request, dto) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.safety.report(sub, dto);
    }
    listReports(request, query) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.safety.listMyReports(sub, query.offset ?? 0, query.limit ?? 20);
    }
    getExclusions(request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.safety.getExclusions(sub);
    }
};
exports.SafetyController = SafetyController;
__decorate([
    (0, common_1.Post)('blocks'),
    (0, common_2.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Block a user (also triggers conversation cleanup in messaging service)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, safety_dto_1.BlockTargetDto]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "block", null);
__decorate([
    (0, common_1.Delete)('blocks/:targetId'),
    (0, common_2.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Unblock a user' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "unblock", null);
__decorate([
    (0, common_1.Post)('reports'),
    (0, common_2.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Report a user (max 3/day per target)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, safety_dto_1.ReportDto]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "report", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, common_2.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List my reports' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, safety_dto_1.ReportQueryDto]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "listReports", null);
__decorate([
    (0, common_1.Get)('exclusions'),
    (0, common_2.UseGuards)(shared_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Block exclusions for the matching service (exact contract shape)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "getExclusions", null);
exports.SafetyController = SafetyController = __decorate([
    (0, swagger_1.ApiTags)('safety'),
    (0, common_1.Controller)('safety'),
    __metadata("design:paramtypes", [safety_service_1.SafetyService])
], SafetyController);
//# sourceMappingURL=safety.controller.js.map