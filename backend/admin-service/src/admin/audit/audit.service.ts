import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLog } from '../../common/types';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 50, entity?: string, adminId?: string) {
    const skip = (page - 1) * limit;
    let whereClause: any = {};
    if (entity) whereClause.entity = entity;
    if (adminId) whereClause.adminId = adminId;

    const [auditLogs, total] = await this.prisma.$queryRaw<AuditLog[]>`
      SELECT id, "adminId", "entity", "entityId", "action", "oldData", "newData", "ipAddress", "userAgent", "createdAt"
      FROM "AuditLog"
      WHERE CAST(${JSON.stringify(whereClause)} AS jsonb)
      ORDER BY "createdAt" DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
    const totalCount = await this.prisma.auditLog.count();
    return { auditLogs, total: totalCount };
  }

  async findByEntity(entity: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAdmin(adminId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [auditLogs, total] = await this.prisma.$queryRaw<AuditLog[]>`
      SELECT id, "adminId", "entity", "entityId", "action", "oldData", "newData", "ipAddress", "userAgent", "createdAt"
      FROM "AuditLog"
      WHERE "adminId" = ${adminId}
      ORDER BY "createdAt" DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
    const totalCount = await this.prisma.auditLog.count({ where: { adminId } });
    return { auditLogs, total: totalCount };
  }
}