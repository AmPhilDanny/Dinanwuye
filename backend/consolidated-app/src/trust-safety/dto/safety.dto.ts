import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { REPORT_CATEGORIES } from '../../shared';

export class BlockTargetDto {
  @ApiProperty({ example: 'uuid-of-user-to-block' })
  @IsString()
  @Length(8, 64)
  targetId!: string;

  @ApiPropertyOptional({ example: 'harassment' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}

export class ReportDto {
  @ApiProperty({ example: 'uuid-of-user-to-report' })
  @IsString()
  @Length(8, 64)
  targetId!: string;

  @ApiProperty({ enum: REPORT_CATEGORIES, example: 'harassment' })
  @IsIn(REPORT_CATEGORIES)
  category!: string;

  @ApiPropertyOptional({ example: 'Sent me unsolicited messages' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;

  @ApiPropertyOptional({ example: 'conversation:abc' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contextRef?: string;
}

export class ReportQueryDto {
  @ApiPropertyOptional({ example: 0 })
  offset?: number;

  @ApiPropertyOptional({ example: 20 })
  limit?: number;
}

export class ExclusionsDto {
  @ApiProperty({ type: [String], example: ['uuid-1', 'uuid-2'] })
  blockedBy!: string[];

  @ApiProperty({ type: [String], example: ['uuid-3'] })
  blocking!: string[];
}

export class ReportResponseDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uuid-of-target' })
  targetId!: string;

  @ApiProperty({ example: 'harassment' })
  category!: string;

  @ApiPropertyOptional()
  details?: string | null;

  @ApiProperty({ example: 'pending' })
  status!: string;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  createdAt!: Date;
}
