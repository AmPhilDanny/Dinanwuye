import 'reflect-metadata';
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionGuard } from '../../auth/permission.guard';
import { RequirePermission } from '../../auth/permissions';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Controller('photos')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('photos:read')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  async findAll() {
    return this.photosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  @Post()
  async create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.create(createPhotoDto);
  }

  @Put(':id')
  @RequirePermission('photos:moderate')
  async update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  @RequirePermission('photos:moderate')
  async remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }
}