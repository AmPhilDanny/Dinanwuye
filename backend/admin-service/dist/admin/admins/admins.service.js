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
exports.AdminsService = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
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
        const totalCount = await this.prisma.$executeRaw `SELECT COUNT(*) FROM "AdminUser"`;
        return { admins, total: total || 0 };
    }
    async findOne(id) {
        const admin = await this.prisma.$queryRaw `
      SELECT id, email, name, role, isActive, lastLoginAt, createdAt
      FROM "AdminUser"
      WHERE id = ${id}
    `;
        if (!admin || admin.length === 0) {
            throw new common_1.NotFoundException(`Admin with ID ${id} not found`);
        }
        return admin[0];
    }
    async create(createAdminDto) {
        await this.prisma.$executeRaw `INSERT INTO "AdminUser" (email, name, passwordHash, role, isActive, permissions)
      VALUES (${createAdminDto.email}, ${createAdminDto.name}, ${createAdminDto.passwordHash}, ${createAdminDto.role || 'admin'}, true, ${createAdminDto.permissions || '[]'})`;
        return { inserted: true };
    }
    async update(id, updateAdminDto) {
        const setClause = Object.entries(updateAdminDto)
            .filter(([key]) => key in { email: true, name: true, role: true, isActive: true, permissions: true })
            .map(([key, value]) => `"${key}" = ${typeof value === 'string' ? `'${value}'` : value}`)
            .join(', ');
        await this.prisma.$executeRaw `UPDATE "AdminUser" SET ${setClause} WHERE id = ${id}`;
        return { updated: true };
    }
    async remove(id) {
        await this.prisma.$executeRaw `DELETE FROM "AdminUser" WHERE id = ${id}`;
        return { deleted: true };
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminsService);
//# sourceMappingURL=admins.service.js.map