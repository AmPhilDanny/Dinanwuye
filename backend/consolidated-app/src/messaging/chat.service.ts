import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import {
  ConversationDetailDto,
  ConversationSummaryDto,
  MessageDto,
  MessagesPageDto,
  SendMessageDto,
} from './dto/chat.dto';

function toMessageDto(m: {
  id: string;
  conversationId: string;
  senderId: string;
  contentEncrypted: string;
  contentType: string;
  mediaRef: string | null;
  readAt: Date | null;
  createdAt: Date;
}): MessageDto {
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    // V0: contentEncrypted stores plaintext (E2EE is Phase 2).
    content: m.contentEncrypted,
    contentType: m.contentType,
    mediaRef: m.mediaRef,
    readAt: m.readAt,
    createdAt: m.createdAt,
  };
}

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async listConversations(userId: string): Promise<ConversationSummaryDto[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }], status: 'active' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const unreadCounts = await this.prisma.message.groupBy({
      by: ['conversationId'],
      where: {
        conversationId: { in: conversations.map((c: any) => c.id) },
        senderId: { not: userId },
        readAt: null,
      },
      _count: { id: true },
    });
    const unreadByConv = new Map(unreadCounts.map((u: any) => [u.conversationId, u._count.id]));

    return conversations.map((c: any) => ({
      id: c.id,
      otherUserId: c.userAId === userId ? c.userBId : c.userAId,
      lastMessage: c.messages[0] ? toMessageDto(c.messages[0]) : null,
      unreadCount: unreadByConv.get(c.id) ?? 0,
      updatedAt: c.updatedAt,
    }));
  }

  async getConversation(conversationId: string, userId: string): Promise<ConversationDetailDto> {
    const conv = await this.assertParticipant(conversationId, userId);
    return {
      id: conv.id,
      userAId: conv.userAId,
      userBId: conv.userBId,
      status: conv.status,
      createdAt: conv.createdAt,
    };
  }

  async getMessages(
    conversationId: string,
    userId: string,
    cursor?: string,
    limit = 50,
  ): Promise<MessagesPageDto> {
    await this.assertParticipant(conversationId, userId);

    const take = Math.min(Math.max(limit, 1), 100);
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
    });

    const hasMore = messages.length > take;
    const page = messages.slice(0, take);
    const last = page[page.length - 1];

    return {
      items: page.map(toMessageDto).reverse(),
      nextCursor: hasMore && last ? last.createdAt.toISOString() : undefined,
      hasMore,
    };
  }

  async createMessage(conversationId: string, senderId: string, dto: SendMessageDto): Promise<MessageDto> {
    await this.assertParticipant(conversationId, senderId);

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        contentEncrypted: dto.content, // V0 plaintext (E2EE in Phase 2)
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return toMessageDto(message);
  }

  async markRead(conversationId: string, userId: string, messageIds: string[]): Promise<{ success: true }> {
    await this.assertParticipant(conversationId, userId);

    await this.prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return { success: true };
  }

  async deleteConversation(conversationId: string, userId: string): Promise<{ success: true }> {
    await this.assertParticipant(conversationId, userId);

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status: 'closed' },
    });

    return { success: true };
  }

  async findConversationBetween(userA: string, userB: string): Promise<ConversationDetailDto | null> {
    const conv = await this.prisma.conversation.findUnique({
      where: {
        userAId_userBId: { userAId: userA, userBId: userB },
      },
    });
    if (!conv) return null;
    return {
      id: conv.id,
      userAId: conv.userAId,
      userBId: conv.userBId,
      status: conv.status,
      createdAt: conv.createdAt,
    };
  }

  async getOrCreateConversation(myUserId: string, otherUserId: string): Promise<ConversationDetailDto> {
    if (myUserId === otherUserId) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }

    // Canonical ordering so the composite unique (userAId, userBId) is deterministic
    const [userAId, userBId] = [myUserId, otherUserId].sort();

    const existing = await this.prisma.conversation.findUnique({
      where: { userAId_userBId: { userAId, userBId } },
    });
    if (existing) {
      return {
        id: existing.id,
        userAId: existing.userAId,
        userBId: existing.userBId,
        status: existing.status,
        createdAt: existing.createdAt,
      };
    }

    const created = await this.prisma.conversation.create({
      data: { userAId, userBId, status: 'active' },
    });
    return {
      id: created.id,
      userAId: created.userAId,
      userBId: created.userBId,
      status: created.status,
      createdAt: created.createdAt,
    };
  }

  private async assertParticipant(
    conversationId: string,
    userId: string,
  ): Promise<{ id: string; userAId: string; userBId: string; status: string; createdAt: Date }> {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }
    if (conv.userAId !== userId && conv.userBId !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }
    return conv;
  }
}
