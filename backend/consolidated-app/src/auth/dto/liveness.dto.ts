import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class LivenessResultDto {
  @IsArray()
  @IsString({ each: true })
  challenges!: string[];

  @IsArray()
  @IsString({ each: true })
  completed!: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsOptional()
  @IsString()
  deviceRef?: string;
}
