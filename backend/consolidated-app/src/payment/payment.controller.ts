import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, getUserFromRequest } from '../shared';
import type { JwtRequest } from '../shared';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly payment: PaymentService) {}

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscription' })
  getSubscription(@Req() request: JwtRequest) {
    const { sub } = getUserFromRequest(request);
    return this.payment.getSubscription(sub);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create checkout session' })
  createCheckout(
    @Req() request: JwtRequest,
    @Body() body: { planId: string; provider: string },
  ) {
    const { sub } = getUserFromRequest(request);
    return this.payment.createCheckout(sub, body.planId, body.provider);
  }
}
