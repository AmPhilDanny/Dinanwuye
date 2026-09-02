"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
function toMessageDto(m) {
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
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listConversations(userId) {
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
                conversationId: { in: conversations.map((c) => c.id) },
                senderId: { not: userId },
                readAt: null,
            },
            _count: { id: true },
        });
        const unreadByConv = new Map(unreadCounts.map((u) => [u.conversationId, u._count.id]));
        return conversations.map((c) => ({
            id: c.id,
            otherUserId: c.userAId === userId ? c.userBId : c.userAId,
            lastMessage: c.messages[0] ? toMessageDto(c.messages[0]) : null,
            unreadCount: unreadByConv.get(c.id) ?? 0,
            updatedAt: c.updatedAt,
        }));
    }
    async getConversation(conversationId, userId) {
        const conv = await this.assertParticipant(conversationId, userId);
        return {
            id: conv.id,
            userAId: conv.userAId,
            userBId: conv.userBId,
            status: conv.status,
            createdAt: conv.createdAt,
        };
    }
    async getMessages(conversationId, userId, cursor, limit = 50) {
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
    async createMessage(conversationId, senderId, dto) {
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
    async markRead(conversationId, userId, messageIds) {
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
    async deleteConversation(conversationId, userId) {
        await this.assertParticipant(conversationId, userId);
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { status: 'closed' },
        });
        return { success: true };
    }
    async findConversationBetween(userA, userB) {
        const conv = await this.prisma.conversation.findUnique({
            where: {
                userAId_userBId: { userAId: userA, userBId: userB },
            },
        });
        if (!conv)
            return null;
        return {
            id: conv.id,
            userAId: conv.userAId,
            userBId: conv.userBId,
            status: conv.status,
            createdAt: conv.createdAt,
        };
    }
    async getOrCreateConversation(myUserId, otherUserId) {
        if (myUserId === otherUserId) {
            throw new common_1.BadRequestException('Cannot start a conversation with yourself');
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
    async assertParticipant(conversationId, userId) {
        const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conv) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (conv.userAId !== userId && conv.userBId !== userId) {
            throw new common_1.ForbiddenException('You are not a participant in this conversation');
        }
        return conv;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map