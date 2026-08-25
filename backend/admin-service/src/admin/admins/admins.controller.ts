import 'reflect-metadata';
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionGuard } from '../../auth/permission.guard';
import { RequirePermission } from '../../auth/permissions';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('admins:read')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.adminsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Post()
  @RequirePermission('admins:manage')
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Put(':id')
  @RequirePermission('admins:manage')
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @RequirePermission('admins:manage')
  async remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}