import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, getUserFromRequest } from '../shared';
import type { JwtRequest } from '../shared';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, LogoutDto, OtpSendResponseDto, RefreshDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';
import { LivenessResultDto } from './dto/liveness.dto';
import { OtpService } from '../otp/otp.service';
import { LivenessService } from './liveness.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly otp: OtpService,
    private readonly liveness: LivenessService,
  ) {}

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Create an account with email or phone + password' })
  signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.auth.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Login with email/phone + password' })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.auth.login(dto);
  }

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Request an OTP for phone login/signup verification' })
  async sendOtp(@Body() dto: { identifier: string; purpose: 'signup' | 'login' | 'password_reset' }): Promise<OtpSendResponseDto> {
    const { retryAfterSeconds } = await this.otp.send(dto.identifier, dto.purpose, null);
    return { message: 'otp sent', retryAfterSeconds };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Verify an OTP code' })
  verifyOtp(@Body() dto: VerifyOtpDto): Promise<AuthResponseDto> {
    return this.auth.verifyOtp(dto);
  }

  @Post('liveness/challenge')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getLivenessChallenge(): { challenges: string[] } {
    return { challenges: this.liveness.createChallenge() };
  }

  @Post('liveness/verify')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  verifyLiveness(@Req() request: JwtRequest, @Body() dto: LivenessResultDto) {
    const { sub } = getUserFromRequest(request);
    return this.liveness.recordResult(sub, dto.challenges, dto.completed, dto.confidence, dto.deviceRef);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token, issue fresh token pair' })
  refresh(@Body() dto: RefreshDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.auth.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke the refresh token' })
  logout(@Req() request: JwtRequest, @Body() dto: LogoutDto): Promise<{ success: true }> {
    const { sub } = getUserFromRequest(request);
    return this.auth.logout(sub, dto);
  }
}
