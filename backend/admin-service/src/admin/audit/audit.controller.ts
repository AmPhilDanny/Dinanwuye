import 'reflect-metadata';
import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionGuard } from '../../auth/permission.guard';
import { RequirePermission } from '../../auth/permissions';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('audit:read')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 50, @Query('entity') entity?: string, @Query('adminId') adminId?: string) {
    return this.auditService.findAll(page, limit, entity);
  }

  @Get('entity/:entity/:entityId')
  async findByEntity(@Param('entity') entity: string, @Param('entityId') entityId: string) {
    return this.auditService.findByEntity(entity, entityId);
  }

  @Get('admin/:adminId')
  async findByAdmin(@Param('adminId') adminId: string, @Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.auditService.findByAdmin(adminId, page, limit);
  }
}