import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, getUserFromRequest } from '../shared';
import type { JwtRequest } from '../shared';
import { NotificationService } from './notification.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notification: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user notifications' })
  getNotifications(@Req() request: JwtRequest) {
    const { sub } = getUserFromRequest(request);
    return this.notification.getNotifications(sub);
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe to push notifications' })
  subscribe(
    @Req() request: JwtRequest,
    @Body() body: { endpoint: string; p256dh: string; auth: string },
  ) {
    const { sub } = getUserFromRequest(request);
    return this.notification.subscribe(sub, body);
  }
}
