import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export const GENDERS = ['male', 'female', 'non_binary'] as const;
export const SEEKING_OPTIONS = ['men', 'women', 'everyone'] as const;

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Chinelo' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name?: string;

  @ApiPropertyOptional({ example: '1996-04-12' })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiPropertyOptional({ enum: GENDERS, example: 'female' })
  @IsOptional()
  @IsEnum(GENDERS)
  gender?: string;

  @ApiPropertyOptional({ type: [String], enum: SEEKING_OPTIONS, example: ['men'] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsIn(SEEKING_OPTIONS, { each: true })
  seeking?: string[];

  @ApiPropertyOptional({ example: 'Love good food and long walks...' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: 168 })
  @IsOptional()
  @IsInt()
  @Min(120)
  @Max(230)
  heightCm?: number;

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

  @ApiPropertyOptional({ example: 'serious' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  relationshipIntent?: string;

  @ApiPropertyOptional({ example: 'BSc' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  education?: string;

  @ApiPropertyOptional({ example: 'Engineer' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  occupation?: string;

  @ApiPropertyOptional({ type: [String], example: ['Igbo', 'English'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ type: [String], example: ['music', 'faith', 'travel'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ example: 6.5244 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  locationLat?: number;

  @ApiPropertyOptional({ example: 3.3792 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  locationLng?: number;

  @ApiPropertyOptional({ example: 'Lagos, Nigeria' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  locationName?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  onboardingStep?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  onboardingComplete?: boolean;
}

export class CreatePhotoDto {
  @ApiProperty({ example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...' })
  @IsString()
  @MinLength(5)
  @MaxLength(12_000_000)
  dataUrl!: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class PhotoDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...' })
  s3Key!: string;

  @ApiProperty({ example: 0 })
  order!: number;

  @ApiProperty({ example: 'pending' })
  moderationStatus!: string;
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ example: 21 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  ageMin?: number;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  ageMax?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  distanceKm?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showOnlineStatus?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showDistance?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  incognitoMode?: boolean;
}

export class PreferencesDto {
  @ApiProperty({ example: 21 })
  ageMin!: number;

  @ApiProperty({ example: 45 })
  ageMax!: number;

  @ApiProperty({ example: 50 })
  distanceKm!: number;

  @ApiProperty({ example: true })
  showOnlineStatus!: boolean;

  @ApiProperty({ example: true })
  showDistance!: boolean;

  @ApiProperty({ example: false })
  incognitoMode!: boolean;
}

export class CandidateDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uuid', description: 'Auth service user ID used by matching and messaging' })
  userId!: string;

  @ApiProperty({ example: 29 })
  age!: number;

  @ApiProperty({ example: 'female' })
  gender!: string;

  @ApiProperty({ type: [String], example: ['men'] })
  seeking!: string[];

  @ApiProperty({ type: [String], example: ['music', 'travel'] })
  interests!: string[];

  @ApiPropertyOptional({
    example: { lat: 6.5244, lng: 3.3792 },
  })
  locationGeo?: { lat: number; lng: number } | null;

  @ApiPropertyOptional({ example: 'Lagos, Nigeria' })
  locationName?: string | null;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  lastActiveAt!: Date;

  @ApiProperty({ example: true })
  isVerified!: boolean;

  @ApiProperty({ example: false })
  isPremium!: boolean;
}

export class ProfileResponseDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uuid' })
  userId!: string;

  @ApiProperty({ example: 'Chinelo' })
  name!: string;

  @ApiProperty({ example: 29 })
  age!: number;

  @ApiProperty({ example: 'female' })
  gender!: string;

  @ApiProperty({ type: [String], example: ['men'] })
  seeking!: string[];

  @ApiPropertyOptional()
  bio?: string | null;

  @ApiPropertyOptional()
  heightCm?: number | null;

  @ApiPropertyOptional()
  ethnicity?: string | null;

  @ApiPropertyOptional()
  religion?: string | null;

  @ApiPropertyOptional()
  relationshipIntent?: string | null;

  @ApiPropertyOptional()
  education?: string | null;

  @ApiPropertyOptional()
  occupation?: string | null;

  @ApiProperty({ type: [String] })
  languages!: string[];

  @ApiProperty({ type: [String] })
  interests!: string[];

  @ApiPropertyOptional({ example: { lat: 6.5244, lng: 3.3792 } })
  locationGeo?: { lat: number; lng: number } | null;

  @ApiPropertyOptional()
  locationName?: string | null;

  @ApiProperty({ example: false })
  isVerified!: boolean;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: false })
  isPremium!: boolean;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  lastActiveAt!: Date;

  @ApiProperty({ example: 3 })
  onboardingStep!: number;

  @ApiProperty({ example: false })
  onboardingComplete!: boolean;

  @ApiProperty({ type: [PhotoDto] })
  photos!: PhotoDto[];
}

export class PublicProfileDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uuid' })
  userId!: string;

  @ApiProperty({ example: 'Chinelo' })
  name!: string;

  @ApiProperty({ example: 29 })
  age!: number;

  @ApiProperty({ example: 'female' })
  gender!: string;

  @ApiPropertyOptional()
  bio?: string | null;

  @ApiProperty({ type: [String] })
  interests!: string[];

  @ApiPropertyOptional()
  locationName?: string | null;

  @ApiProperty({ example: true })
  isVerified!: boolean;

  @ApiProperty({ type: [PhotoDto] })
  photos!: PhotoDto[];
}
