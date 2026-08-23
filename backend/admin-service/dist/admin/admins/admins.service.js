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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsService = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminsService = class AdminsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [admins, total] = await this.prisma.$queryRaw `
      SELECT id, email, name, role, isActive, lastLoginAt, createdAt
      FROM "AdminUser"
      ORDER BY createdAt DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
        const totalCount = await this.prisma.adminUser.count();
        return { admins, total: totalCount };
    }
    async findOne(id) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { id },
        });
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with ID ${id} not found`);
        }
        const { passwordHash, ...result } = admin;
        return result;
    }
    async create(createAdminDto) {
        const admin = await this.prisma.adminUser.create({
            data: {
                email: createAdminDto.email,
                name: createAdminDto.name,
                passwordHash: createAdminDto.passwordHash,
                role: createAdminDto.role || 'admin',
                isActive: true,
                permissions: createAdminDto.permissions || [],
            },
        });
        const { passwordHash, ...result } = admin;
        return result;
    }
    async update(id, updateAdminDto) {
        const admin = await this.prisma.adminUser.update({
            where: { id },
            data: updateAdminDto,
        });
        const { passwordHash, ...result } = admin;
        return result;
    }
    async remove(id) {
        await this.prisma.adminUser.delete({
            where: { id },
        });
        return { message: `Admin ${id} deleted successfully` };
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AdminsService);
//# sourceMappingURL=admins.service.js.map