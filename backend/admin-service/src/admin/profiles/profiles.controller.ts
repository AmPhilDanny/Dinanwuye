import 'reflect-metadata';
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionGuard } from '../../auth/permission.guard';
import { RequirePermission } from '../../auth/permissions';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('profiles:read')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.profilesService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }
}