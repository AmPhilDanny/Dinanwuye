import 'reflect-metadata';
import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.matchesService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }
}