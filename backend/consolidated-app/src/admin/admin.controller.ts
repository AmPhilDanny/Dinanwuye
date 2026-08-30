import { Body, Controller, Get, Post, Put, Delete, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, getUserFromRequest } from '../shared';
import type { JwtRequest } from '../shared';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminResponseDto, UpdateUserStatusDto, UserManagementDto } from './dto/admin.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  login(@Body() dto: AdminLoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.admin.login(dto);
  }

  @Get('auth/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin' })
  getMe(@Req() request: JwtRequest): Promise<AdminResponseDto> {
    const { sub } = getUserFromRequest(request);
    return this.admin.getAdmin(sub);
  }

  @Get('dashboard/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalMatches: number;
    totalReports: number;
    pendingReports: number;
  }> {
    return this.admin.getDashboardStats();
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users' })
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ users: UserManagementDto[]; total: number }> {
    return this.admin.getUsers(page, limit);
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user details' })
  getUser(@Param('id') id: string): Promise<UserManagementDto> {
    return this.admin.getUser(id);
  }

  @Put('users/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user status (ban/unban)' })
  updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<{ success: true }> {
    return this.admin.updateUserStatus(id, dto);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all reports' })
  getReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ reports: any[]; total: number }> {
    return this.admin.getReports(page, limit);
  }
}
