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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("../shared");
const admin_service_1 = require("./admin.service");
const admin_dto_1 = require("./dto/admin.dto");
const admin_jwt_strategy_1 = require("./admin-jwt.strategy");
let AdminController = class AdminController {
    admin;
    constructor(admin) {
        this.admin = admin;
    }
    login(dto) {
        return this.admin.login(dto);
    }
    getMe(request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.admin.getAdmin(sub);
    }
    getDashboardStats() {
        return this.admin.getDashboardStats();
    }
    getUsers(page = 1, limit = 50, search) {
        return this.admin.getUsers(page, limit, search);
    }
    getUser(id) {
        return this.admin.getUser(id);
    }
    updateUserStatus(id, dto, request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.admin.updateUserStatus(id, dto, sub);
    }
    updateUserProfile(id, dto, request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.admin.updateUserProfile(id, dto, sub);
    }
    deleteUser(id, request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.admin.deleteUser(id, sub);
    }
    getReports(page = 1, limit = 50) {
        return this.admin.getReports(page, limit);
    }
    getProfiles(page = 1, limit = 50) {
        return this.admin.getProfiles(page, limit);
    }
    getPhotos(page = 1, limit = 50) {
        return this.admin.getPhotos(page, limit);
    }
    updatePhotoModeration(id, dto, request) {
        const { sub } = (0, shared_1.getUserFromRequest)(request);
        return this.admin.updatePhotoModeration(id, dto.status, dto.reason, sub);
    }
    getMatches(page = 1, limit = 50) {
        return this.admin.getMatches(page, limit);
    }
    getAudit(page = 1, limit = 50) {
        return this.admin.getAudit(page, limit);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Admin login' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('auth/me'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current admin' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all users with optional search' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Put)('users/:id/status'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user status (ban/unban/suspend)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateUserStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Put)('users/:id/profile'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admin update user profile fields' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.AdminUpdateUserProfileDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete a user and all related data' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all reports' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)('profiles'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getProfiles", null);
__decorate([
    (0, common_1.Get)('photos'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPhotos", null);
__decorate([
    (0, common_1.Put)('photos/:id/moderation'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Moderate a photo (approve/reject/flag)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.ModeratePhotoDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updatePhotoModeration", null);
__decorate([
    (0, common_1.Get)('matches'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMatches", null);
__decorate([
    (0, common_1.Get)('audit'),
    (0, common_1.UseGuards)(admin_jwt_strategy_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAudit", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map