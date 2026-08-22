import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MarkReadDto, SendMessageDto } from './dto/chat.dto';
interface AuthedSocket extends Socket {
    data: {
        userId: string;
    };
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chat;
    private readonly jwt;
    private readonly config;
    server: Server;
    private readonly logger;
    private readonly presence;
    constructor(chat: ChatService, jwt: JwtService, config: ConfigService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    joinConversation(client: AuthedSocket, body: {
        conversationId: string;
    }): Promise<void>;
    sendMessage(client: AuthedSocket, body: {
        conversationId: string;
    } & SendMessageDto): Promise<void>;
    typingStart(client: AuthedSocket, body: {
        conversationId: string;
    }): Promise<void>;
    typingStop(client: AuthedSocket, body: {
        conversationId: string;
    }): Promise<void>;
    markRead(client: AuthedSocket, body: {
        conversationId: string;
    } & MarkReadDto): Promise<void>;
}
export {};
//# sourceMappingURL=chat.gateway.d.ts.map