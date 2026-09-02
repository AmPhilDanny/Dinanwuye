import { Body, Controller, Get, Post, Put, Delete, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getUserFromRequest } from '../shared';
import type { JwtRequest } from '../shared';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminResponseDto, AdminUpdateUserProfileDto, ModeratePhotoDto, UpdateUserStatusDto, UserManagementDto } from './dto/admin.dto';
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
  @ApiOperation({ summary: 'List all users with optional search' })
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
  ): Promise<{ users: UserManagementDto[]; total: number }> {
    return this.admin.getUsers(page, limit, search);
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
  @ApiOperation({ summary: 'Update user status (ban/unban/suspend)' })
  updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() request: JwtRequest,
  ): Promise<{ success: true }> {
    const { sub } = getUserFromRequest(request);
    return this.admin.updateUserStatus(id, dto, sub);
  }

  @Put('users/:id/profile')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update user profile fields' })
  updateUserProfile(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserProfileDto,
    @Req() request: JwtRequest,
  ): Promise<{ success: true }> {
    const { sub } = getUserFromRequest(request);
    return this.admin.updateUserProfile(id, dto, sub);
  }

  @Delete('users/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete a user and all related data' })
  deleteUser(
    @Param('id') id: string,
    @Req() request: JwtRequest,
  ): Promise<{ success: true }> {
    const { sub } = getUserFromRequest(request);
    return this.admin.deleteUser(id, sub);
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
  @ApiOperation({ summary: 'Moderate a photo (approve/reject/flag)' })
  updatePhotoModeration(
    @Param('id') id: string,
    @Body() dto: ModeratePhotoDto,
    @Req() request: JwtRequest,
  ) {
    const { sub } = getUserFromRequest(request);
    return this.admin.updatePhotoModeration(id, dto.status, dto.reason, sub);
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
