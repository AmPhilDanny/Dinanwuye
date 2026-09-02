import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@dinanwuye.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'admin-password' })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class AdminResponseDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'admin@dinanwuye.com' })
  email!: string;

  @ApiProperty({ example: 'Admin User' })
  name!: string;

  @ApiProperty({ example: 'super_admin' })
  role!: string;

  @ApiProperty({ type: [String] })
  permissions!: string[];
}

export class ModeratePhotoDto {
  @ApiProperty({ enum: ['approved', 'rejected', 'flagged', 'pending'] })
  @IsEnum(['approved', 'rejected', 'flagged', 'pending'] as const)
  status!: 'approved' | 'rejected' | 'flagged' | 'pending';

  @ApiPropertyOptional({ example: 'Photo does not meet community guidelines' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason?: string;
}

export class UpdateUserStatusDto {
  @ApiProperty({ enum: ['active', 'suspended', 'banned', 'deleted'] })
  @IsEnum(['active', 'suspended', 'banned', 'deleted'])
  status!: string;

  @ApiPropertyOptional({ example: 'Violated terms of service' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ example: '2026-12-31T00:00:00.000Z', description: 'Optional expiry for suspension/ban' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class AdminUpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'Chinelo' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name?: string;

  @ApiPropertyOptional({ example: 'female', enum: ['male', 'female', 'non_binary'] })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: 'Love good food and long walks...' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: 'Igbo' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  ethnicity?: string;

  @ApiPropertyOptional({ example: 'Christian' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  religion?: string;

  @ApiPropertyOptional({ example: 'Engineer' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  occupation?: string;

  @ApiPropertyOptional({ example: 'Lagos, Nigeria' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  locationName?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isVerified?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isPremium?: boolean;
}

export class UserManagementDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email?: string | null;

  @ApiProperty({ example: '+2348012345678' })
  phone?: string | null;

  @ApiProperty({ example: 'active' })
  status!: string;

  @ApiProperty({ example: 'user' })
  role!: string;

  @ApiProperty({ example: true })
  isVerified!: boolean;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional()
  photo?: string | null;

  @ApiPropertyOptional()
  profile?: {
    name: string;
    gender: string;
    bio?: string | null;
    ethnicity?: string | null;
    religion?: string | null;
    occupation?: string | null;
    locationName?: string | null;
    isVerified: boolean;
    isActive: boolean;
    isPremium: boolean;
    interests?: string[];
    languages?: string[];
    relationshipIntent?: string | null;
    heightCm?: number | null;
  } | null;
}
