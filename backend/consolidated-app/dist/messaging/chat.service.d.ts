import { PrismaService } from '../prisma/prisma.module';
import { ConversationDetailDto, ConversationSummaryDto, MessageDto, MessagesPageDto, SendMessageDto } from './dto/chat.dto';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listConversations(userId: string): Promise<ConversationSummaryDto[]>;
    getConversation(conversationId: string, userId: string): Promise<ConversationDetailDto>;
    getMessages(conversationId: string, userId: string, cursor?: string, limit?: number): Promise<MessagesPageDto>;
    createMessage(conversationId: string, senderId: string, dto: SendMessageDto): Promise<MessageDto>;
    markRead(conversationId: string, userId: string, messageIds: string[]): Promise<{
        success: true;
    }>;
    deleteConversation(conversationId: string, userId: string): Promise<{
        success: true;
    }>;
    findConversationBetween(userA: string, userB: string): Promise<ConversationDetailDto | null>;
    getOrCreateConversation(myUserId: string, otherUserId: string): Promise<ConversationDetailDto>;
    private assertParticipant;
}
//# sourceMappingURL=chat.service.d.ts.map