import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';

export const OTP_PURPOSES = ['signup', 'login', 'password_reset'] as const;
export type OtpPurpose = (typeof OTP_PURPOSES)[number];

export class SignupDto {
  @ApiPropertyOptional({ example: 'chioma@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+2348012345678' })
  @IsOptional()
  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'phone must be a valid E.164 number' })
  phone?: string;

  @ApiProperty({ example: 'secret-password' })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'chioma@example.com' })
  @IsString()
  identifier!: string;

  @ApiProperty({ example: 'secret-password' })
  @IsString()
  password!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'chioma@example.com' })
  @IsString()
  identifier!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'code must be numeric' })
  code!: string;

  @ApiProperty({ enum: OTP_PURPOSES, example: 'login' })
  @IsEnum(OTP_PURPOSES)
  purpose!: OtpPurpose;
}

export class RefreshDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  @IsString()
  refreshToken!: string;
}

export class LogoutDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  @IsString()
  refreshToken!: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'uuid' })
  userId!: string;

  @ApiPropertyOptional({ example: 'chioma@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: '+2348012345678' })
  phone?: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken!: string;

  @ApiProperty({ example: false })
  isNewUser!: boolean;
}

export class OtpSendResponseDto {
  @ApiProperty({ example: 'otp sent' })
  message!: string;

  @ApiPropertyOptional({ example: 60 })
  retryAfterSeconds?: number;
}
