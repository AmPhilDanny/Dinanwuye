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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chat;
    jwt;
    config;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    presence = new Map(); // userId -> socketId (V0 in-memory)
    constructor(chat, jwt, config) {
        this.chat = chat;
        this.jwt = jwt;
        this.config = config;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token;
            if (!token) {
                client.disconnect(true);
                return;
            }
            const payload = this.jwt.verify(token, {
                secret: this.config.get('JWT_SECRET') ?? 'insecure-dev-secret',
            });
            client.data.userId = payload.sub;
            this.presence.set(payload.sub, client.id);
            this.logger.log(`WS connected: user ${payload.sub}`);
        }
        catch {
            client.disconnect(true);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    handleDisconnect(client) {
        const userId = client.data?.userId;
        if (userId) {
            this.presence.delete(userId);
            this.logger.log(`WS disconnected: user ${userId}`);
        }
    }
    async joinConversation(client, body) {
        const userId = client.data.userId;
        await this.chat.getConversation(body.conversationId, userId);
        await client.join(`conversation:${body.conversationId}`);
        client.emit('conversation:joined', { conversationId: body.conversationId });
    }
    async sendMessage(client, body) {
        const userId = client.data.userId;
        const message = await this.chat.createMessage(body.conversationId, userId, { content: body.content });
        this.server.to(`conversation:${body.conversationId}`).emit('message:new', message);
    }
    async typingStart(client, body) {
        await this.chat.getConversation(body.conversationId, client.data.userId);
        client.to(`conversation:${body.conversationId}`).emit('typing', {
            conversationId: body.conversationId,
            userId: client.data.userId,
            typing: true,
        });
    }
    async typingStop(client, body) {
        await this.chat.getConversation(body.conversationId, client.data.userId);
        client.to(`conversation:${body.conversationId}`).emit('typing', {
            conversationId: body.conversationId,
            userId: client.data.userId,
            typing: false,
        });
    }
    async markRead(client, body) {
        await this.chat.markRead(body.conversationId, client.data.userId, body.messageIds);
        this.server.to(`conversation:${body.conversationId}`).emit('read', {
            conversationId: body.conversationId,
            messageIds: body.messageIds,
            userId: client.data.userId,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('conversation:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing:start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "typingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing:stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "typingStop", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "markRead", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:8100', 'https://dinanwuye.com', 'https://www.dinanwuye.com'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map