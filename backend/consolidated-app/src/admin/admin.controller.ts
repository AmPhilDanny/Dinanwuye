import { Body, Controller, Get, Post, Put, Delete, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getUserFromRequest } from '../shared';
import type { JwtRequest } from '../shared';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminResponseDto, UpdateUserStatusDto, UserManagementDto } from './dto/admin.dto';
import { AdminAuthGuard } from './admin-jwt.strategy';

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
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin' })
  getMe(@Req() request: JwtRequest): Promise<AdminResponseDto> {
    const { sub } = getUserFromRequest(request);
    return this.admin.getAdmin(sub);
  }

  @Get('dashboard/stats')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalProfiles: number;
    pendingPhotos: number;
    totalMatches: number;
    totalReports: number;
    pendingReports: number;
  }> {
    return this.admin.getDashboardStats();
  }

  @Get('users')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users' })
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ users: UserManagementDto[]; total: number }> {
    return this.admin.getUsers(page, limit);
  }

  @Get('users/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user details' })
  getUser(@Param('id') id: string): Promise<UserManagementDto> {
    return this.admin.getUser(id);
  }

  @Put('users/:id/status')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user status (ban/unban)' })
  updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<{ success: true }> {
    return this.admin.updateUserStatus(id, dto);
  }

  @Get('reports')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all reports' })
  getReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ reports: any[]; total: number }> {
    return this.admin.getReports(page, limit);
  }

  @Get('profiles')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  getProfiles(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.admin.getProfiles(page, limit);
  }

  @Get('photos')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  getPhotos(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.admin.getPhotos(page, limit);
  }

  @Put('photos/:id/moderation')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  updatePhotoModeration(@Param('id') id: string, @Body() body: { status: 'approved' | 'rejected' | 'flagged' | 'pending' }) {
    return this.admin.updatePhotoModeration(id, body.status);
  }

  @Get('matches')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  getMatches(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.admin.getMatches(page, limit);
  }

  @Get('audit')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  getAudit(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.admin.getAudit(page, limit);
  }
}
