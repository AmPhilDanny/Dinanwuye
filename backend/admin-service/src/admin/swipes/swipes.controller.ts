import 'reflect-metadata';
import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { SwipesService } from './swipes.service';

@Controller('swipes')
@UseGuards(JwtAuthGuard)
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.swipesService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.swipesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.swipesService.remove(id);
  }
}