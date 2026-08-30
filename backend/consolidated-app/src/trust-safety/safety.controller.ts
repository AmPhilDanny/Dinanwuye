import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, getUserFromRequest } from '../shared';
import type { JwtRequest } from '../shared';
import { UseGuards } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { BlockTargetDto, ExclusionsDto, ReportDto, ReportQueryDto, ReportResponseDto } from './dto/safety.dto';

@ApiTags('safety')
@Controller('safety')
export class SafetyController {
  constructor(private readonly safety: SafetyService) {}

  @Post('blocks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block a user (also triggers conversation cleanup in messaging service)' })
  block(@Req() request: JwtRequest, @Body() dto: BlockTargetDto): Promise<{ success: true; blockedId: string }> {
    const { sub } = getUserFromRequest(request);
    return this.safety.block(sub, dto);
  }

  @Delete('blocks/:targetId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unblock a user' })
  unblock(@Req() request: JwtRequest, @Param('targetId') targetId: string): Promise<{ success: true }> {
    const { sub } = getUserFromRequest(request);
    return this.safety.unblock(sub, targetId);
  }

  @Post('reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a user (max 3/day per target)' })
  report(@Req() request: JwtRequest, @Body() dto: ReportDto): Promise<ReportResponseDto> {
    const { sub } = getUserFromRequest(request);
    return this.safety.report(sub, dto);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my reports' })
  listReports(@Req() request: JwtRequest, @Query() query: ReportQueryDto): Promise<ReportResponseDto[]> {
    const { sub } = getUserFromRequest(request);
    return this.safety.listMyReports(sub, query.offset ?? 0, query.limit ?? 20);
  }

  @Get('exclusions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block exclusions for the matching service (exact contract shape)' })
  getExclusions(@Req() request: JwtRequest): Promise<ExclusionsDto> {
    const { sub } = getUserFromRequest(request);
    return this.safety.getExclusions(sub);
  }
}
