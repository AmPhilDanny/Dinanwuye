import type { JwtRequest } from '@dinanwuye/shared';
import { ChatService } from './chat.service';
import { ConversationDetailDto, ConversationSummaryDto, CursorQueryDto, MarkReadDto, MessageDto, MessagesPageDto, SendMessageDto, StartConversationDto } from './dto/chat.dto';
export declare class ChatController {
    private readonly chat;
    constructor(chat: ChatService);
    listConversations(request: JwtRequest): Promise<ConversationSummaryDto[]>;
    getOrCreateConversation(request: JwtRequest, dto: StartConversationDto): Promise<ConversationDetailDto>;
    getConversation(request: JwtRequest, id: string): Promise<ConversationDetailDto>;
    getMessages(request: JwtRequest, id: string, query: CursorQueryDto): Promise<MessagesPageDto>;
    createMessage(request: JwtRequest, id: string, dto: SendMessageDto): Promise<MessageDto>;
    markRead(request: JwtRequest, id: string, dto: MarkReadDto): Promise<{
        success: true;
    }>;
    deleteConversation(request: JwtRequest, id: string): Promise<{
        success: true;
    }>;
}
//# sourceMappingURL=chat.controller.d.ts.map