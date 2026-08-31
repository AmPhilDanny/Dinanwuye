import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChatService } from '../src/messaging/chat.service';
import { PrismaService } from '../src/prisma/prisma.module';

function makePrismaMock() {
  return {
    conversation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      groupBy: jest.fn(),
    },
  };
}

const convRow = {
  id: 'c-1',
  matchId: null,
  userAId: 'u-1',
  userBId: 'u-2',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  messages: [],
};

const msgRow = {
  id: 'm-1',
  conversationId: 'c-1',
  senderId: 'u-1',
  contentEncrypted: 'Hello',
  contentType: 'text',
  mediaRef: null,
  readAt: null,
  createdAt: new Date(),
};

describe('ChatService', () => {
  let service: ChatService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(ChatService);
  });

  describe('listConversations', () => {
    it('computes unread count for messages sent by the other user', async () => {
      prisma.conversation.findMany.mockResolvedValue([convRow]);
      prisma.message.groupBy.mockResolvedValue([
        { conversationId: 'c-1', _count: { id: 2 } },
      ]);

      const result = await service.listConversations('u-1');
      expect(result).toHaveLength(1);
      expect(result[0].otherUserId).toBe('u-2');
      expect(result[0].unreadCount).toBe(2);
    });
  });

  describe('getMessages', () => {
    it('404s for a non-existent conversation', async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);
      await expect(service.getMessages('c-9', 'u-1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('403s when not a participant', async () => {
      prisma.conversation.findUnique.mockResolvedValue(convRow);
      await expect(service.getMessages('c-1', 'u-99')).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('paginates with cursor and marks hasMore', async () => {
      prisma.conversation.findUnique.mockResolvedValue(convRow);
      const oldest = { ...msgRow, id: 'm-1', createdAt: new Date(Date.now() - 2000) };
      const older = { ...msgRow, id: 'm-2', createdAt: new Date(Date.now() - 1000) };
      const newer = { ...msgRow, id: 'm-3', createdAt: new Date() };
      // take = limit + 1 → 3 rows for limit 2 → hasMore true
      prisma.message.findMany.mockResolvedValue([newer, older, oldest]);

      const result = await service.getMessages('c-1', 'u-1', undefined, 2);
      expect(result.items.map((m: any) => m.id)).toEqual(['m-2', 'm-3']);
      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBeDefined();
    });
  });

  describe('createMessage', () => {
    it('rejects empty content', async () => {
      prisma.conversation.findUnique.mockResolvedValue(convRow);
      await expect(service.createMessage('c-1', 'u-1', { content: '' })).rejects.toThrow();
    });

    it('creates a message and touches the conversation', async () => {
      prisma.conversation.findUnique.mockResolvedValue(convRow);
      prisma.message.create.mockResolvedValue(msgRow);
      prisma.conversation.update.mockResolvedValue(convRow);

      const result = await service.createMessage('c-1', 'u-1', { content: 'Hello' });
      expect(result.content).toBe('Hello');
      expect(prisma.conversation.update).toHaveBeenCalled();
    });
  });

  describe('getOrCreateConversation', () => {
    it('rejects starting a conversation with yourself', async () => {
      await expect(service.getOrCreateConversation('u-1', 'u-1')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('returns an existing conversation without creating', async () => {
      prisma.conversation.findUnique.mockResolvedValue(convRow);

      const result = await service.getOrCreateConversation('u-1', 'u-2');
      expect(result.id).toBe('c-1');
      expect(prisma.conversation.create).not.toHaveBeenCalled();
    });

    it('creates a conversation with canonical user ordering', async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);
      prisma.conversation.create.mockResolvedValue(convRow);

      const result = await service.getOrCreateConversation('u-2', 'u-1');
      expect(prisma.conversation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userAId: 'u-1', userBId: 'u-2' }),
        }),
      );
      expect(result.id).toBe('c-1');
    });
  });

  describe('markRead', () => {
    it('only marks messages sent by the other user', async () => {
      prisma.conversation.findUnique.mockResolvedValue(convRow);
      prisma.message.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.markRead('c-1', 'u-1', ['m-1']);
      expect(result).toEqual({ success: true });
      expect(prisma.message.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ senderId: { not: 'u-1' } }),
        }),
      );
    });
  });
});
