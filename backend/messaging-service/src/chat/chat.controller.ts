import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, getUserFromRequest } from '@dinanwuye/shared';
import type { JwtRequest } from '@dinanwuye/shared';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ConversationDetailDto,
  ConversationSummaryDto,
  CursorQueryDto,
  MarkReadDto,
  MessageDto,
  MessagesPageDto,
  SendMessageDto,
  StartConversationDto,
} from './dto/chat.dto';

@ApiTags('conversations')
@Controller('conversations')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my conversations (with last message + unread count)' })
  listConversations(@Req() request: JwtRequest): Promise<ConversationSummaryDto[]> {
    const { sub } = getUserFromRequest(request);
    return this.chat.listConversations(sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get or create a conversation with another user (e.g. from a match)' })
  getOrCreateConversation(
    @Req() request: JwtRequest,
    @Body() dto: StartConversationDto,
  ): Promise<ConversationDetailDto> {
    const { sub } = getUserFromRequest(request);
    return this.chat.getOrCreateConversation(sub, dto.otherUserId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Conversation detail (participant only)' })
  getConversation(@Req() request: JwtRequest, @Param('id') id: string): Promise<ConversationDetailDto> {
    const { sub } = getUserFromRequest(request);
    return this.chat.getConversation(id, sub);
  }

  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cursor-paginated messages (newest first)' })
  getMessages(
    @Req() request: JwtRequest,
    @Param('id') id: string,
    @Query() query: CursorQueryDto,
  ): Promise<MessagesPageDto> {
    const { sub } = getUserFromRequest(request);
    return this.chat.getMessages(id, sub, query.cursor, query.limit);
  }

  @Post(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message via REST (Socket.IO preferred for live)' })
  createMessage(
    @Req() request: JwtRequest,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ): Promise<MessageDto> {
    const { sub } = getUserFromRequest(request);
    return this.chat.createMessage(id, sub, dto);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark messages as read' })
  markRead(
    @Req() request: JwtRequest,
    @Param('id') id: string,
    @Body() dto: MarkReadDto,
  ): Promise<{ success: true }> {
    const { sub } = getUserFromRequest(request);
    return this.chat.markRead(id, sub, dto.messageIds);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close/delete a conversation (soft-close: status=closed)' })
  deleteConversation(@Req() request: JwtRequest, @Param('id') id: string): Promise<{ success: true }> {
    const { sub } = getUserFromRequest(request);
    return this.chat.deleteConversation(id, sub);
  }
}