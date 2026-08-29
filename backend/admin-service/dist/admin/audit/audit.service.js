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
exports.AuditService = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 50, entity, adminId) {
        const skip = (page - 1) * limit;
        let whereClause = {};
        if (entity)
            whereClause.entity = entity;
        if (adminId)
            whereClause.adminId = adminId;
        const [auditLogs, total] = await this.prisma.$queryRaw `
      SELECT id, "adminId", "entity", "entityId", "action", "oldData", "newData", "ipAddress", "userAgent", "createdAt"
      FROM "AuditLog"
      WHERE CAST(${JSON.stringify(whereClause)} AS jsonb)
      ORDER BY "createdAt" DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
        const totalCount = await this.prisma.auditLog.count();
        return { auditLogs, total: totalCount };
    }
    async findByEntity(entity, entityId) {
        return this.prisma.auditLog.findMany({
            where: { entity, entityId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByAdmin(adminId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [auditLogs, total] = await this.prisma.$queryRaw `
      SELECT id, "adminId", "entity", "entityId", "action", "oldData", "newData", "ipAddress", "userAgent", "createdAt"
      FROM "AuditLog"
      WHERE "adminId" = ${adminId}
      ORDER BY "createdAt" DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
        const totalCount = await this.prisma.auditLog.count({ where: { adminId } });
        return { auditLogs, total: totalCount };
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map