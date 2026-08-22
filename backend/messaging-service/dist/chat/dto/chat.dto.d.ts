export declare class SendMessageDto {
    content: string;
}
export declare class StartConversationDto {
    otherUserId: string;
}
export declare class MarkReadDto {
    messageIds: string[];
}
export declare class CursorQueryDto {
    cursor?: string;
    limit?: number;
}
export declare class MessageDto {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    contentType: string;
    mediaRef?: string | null;
    readAt?: Date | null;
    createdAt: Date;
}
export declare class ConversationSummaryDto {
    id: string;
    otherUserId: string;
    lastMessage?: MessageDto | null;
    unreadCount: number;
    updatedAt: Date;
}
export declare class ConversationDetailDto {
    id: string;
    userAId: string;
    userBId: string;
    status: string;
    createdAt: Date;
}
export declare class MessagesPageDto {
    items: MessageDto[];
    nextCursor?: string;
    hasMore: boolean;
}
//# sourceMappingURL=chat.dto.d.ts.map