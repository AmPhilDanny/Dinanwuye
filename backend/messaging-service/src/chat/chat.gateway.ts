import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '@dinanwuye/shared';
import { ChatService } from './chat.service';
import { MarkReadDto, SendMessageDto } from './dto/chat.dto';

interface AuthedSocket extends Socket {
  data: {
    userId: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8100', 'https://dinanwuye.com', 'https://www.dinanwuye.com'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly presence = new Map<string, string>(); // userId -> socketId (V0 in-memory)

  constructor(
    private readonly chat: ChatService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = (client.handshake.auth as { token?: string } | undefined)?.token;
      if (!token) {
        client.disconnect(true);
        return;
      }
      const payload = this.jwt.verify<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_SECRET') ?? 'insecure-dev-secret',
      });
      (client as AuthedSocket).data.userId = payload.sub;
      this.presence.set(payload.sub, client.id);
      this.logger.log(`WS connected: user ${payload.sub}`);
    } catch {
      client.disconnect(true);
      throw new UnauthorizedException('Invalid token');
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = (client as AuthedSocket).data?.userId;
    if (userId) {
      this.presence.delete(userId);
      this.logger.log(`WS disconnected: user ${userId}`);
    }
  }

  @SubscribeMessage('conversation:join')
  async joinConversation(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string },
  ): Promise<void> {
    const userId = client.data.userId;
    await this.chat.getConversation(body.conversationId, userId);
    await client.join(`conversation:${body.conversationId}`);
    client.emit('conversation:joined', { conversationId: body.conversationId });
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string } & SendMessageDto,
  ): Promise<void> {
    const userId = client.data.userId;
    const message = await this.chat.createMessage(body.conversationId, userId, { content: body.content });
    this.server.to(`conversation:${body.conversationId}`).emit('message:new', message);
  }

  @SubscribeMessage('typing:start')
  async typingStart(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string },
  ): Promise<void> {
    await this.chat.getConversation(body.conversationId, client.data.userId);
    client.to(`conversation:${body.conversationId}`).emit('typing', {
      conversationId: body.conversationId,
      userId: client.data.userId,
      typing: true,
    });
  }

  @SubscribeMessage('typing:stop')
  async typingStop(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string },
  ): Promise<void> {
    await this.chat.getConversation(body.conversationId, client.data.userId);
    client.to(`conversation:${body.conversationId}`).emit('typing', {
      conversationId: body.conversationId,
      userId: client.data.userId,
      typing: false,
    });
  }

  @SubscribeMessage('message:read')
  async markRead(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string } & MarkReadDto,
  ): Promise<void> {
    await this.chat.markRead(body.conversationId, client.data.userId, body.messageIds);
    this.server.to(`conversation:${body.conversationId}`).emit('read', {
      conversationId: body.conversationId,
      messageIds: body.messageIds,
      userId: client.data.userId,
    });
  }
}