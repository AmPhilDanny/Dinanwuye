/**
 * @dinanwuye/shared — API DTOs shared across services.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { UserStatus } from './constants';

export class HealthResponseDto {
  @ApiProperty({ example: 'healthy' })
  status!: 'healthy' | 'degraded';

  @ApiProperty({ example: 'auth-service' })
  service!: string;

  @ApiPropertyOptional({ example: '2026-08-17T12:00:00.000Z' })
  timestamp?: string;

  @ApiPropertyOptional({ example: '1.0.0' })
  version?: string;
}

export class PaginatedDto<T> {
  @ApiProperty()
  items!: T[];

  @ApiPropertyOptional({ example: 'cursor-string' })
  nextCursor?: string;

  @ApiProperty()
  hasMore!: boolean;
}

export class ApiErrorDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Validation failed' })
  message!: string | string[];

  @ApiPropertyOptional({ example: 'BAD_REQUEST' })
  error?: string;
}

export class UserPublicDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Chinelo' })
  firstName!: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty({ example: 29 })
  age!: number;

  @ApiPropertyOptional({ example: 'Lagos, Nigeria' })
  locationName?: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiProperty({ type: [String] })
  photos!: string[];

  @ApiProperty({ example: false })
  isVerified!: boolean;

  @ApiProperty({ example: false })
  isPremium!: boolean;

  @ApiProperty({ example: 'active' })
  status!: UserStatus;
}
