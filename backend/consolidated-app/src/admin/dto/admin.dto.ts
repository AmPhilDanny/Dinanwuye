import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
  reason?: string;
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
  profile?: {
    name: string;
    gender: string;
    locationName?: string | null;
  } | null;
}
