import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, IsUUID, Length, MaxLength, Min } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Hello Chinelo!' })
  @IsString()
  @Length(1, 2000)
  content!: string;
}

export class StartConversationDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  otherUserId!: string;
}

export class MarkReadDto {
  @ApiProperty({ type: [String], example: ['msg-1', 'msg-2'] })
  @IsArray()
  @IsString({ each: true })
  messageIds!: string[];
}

export class CursorQueryDto {
  @ApiPropertyOptional({ example: '2026-08-17T12:00:00.000Z' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

export class MessageDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uuid' })
  conversationId!: string;

  @ApiProperty({ example: 'uuid' })
  senderId!: string;

  @ApiProperty({ example: 'Hello' })
  content!: string;

  @ApiProperty({ example: 'text' })
  contentType!: string;

  @ApiPropertyOptional()
  mediaRef?: string | null;

  @ApiPropertyOptional()
  readAt?: Date | null;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  createdAt!: Date;
}

export class ConversationSummaryDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uuid' })
  otherUserId!: string;

  @ApiPropertyOptional()
  lastMessage?: MessageDto | null;

  @ApiProperty({ example: 2 })
  unreadCount!: number;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  updatedAt!: Date;
}

export class ConversationDetailDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uuid' })
  userAId!: string;

  @ApiProperty({ example: 'uuid' })
  userBId!: string;

  @ApiProperty({ example: 'active' })
  status!: string;

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  createdAt!: Date;
}

export class MessagesPageDto {
  @ApiProperty({ type: [MessageDto] })
  items!: MessageDto[];

  @ApiPropertyOptional({ example: 'cursor-string' })
  nextCursor?: string;

  @ApiProperty({ example: false })
  hasMore!: boolean;
}