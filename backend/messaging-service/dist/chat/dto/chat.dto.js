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
exports.MessagesPageDto = exports.ConversationDetailDto = exports.ConversationSummaryDto = exports.MessageDto = exports.CursorQueryDto = exports.MarkReadDto = exports.StartConversationDto = exports.SendMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SendMessageDto {
    content;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello Chinelo!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 2000),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
class StartConversationDto {
    otherUserId;
}
exports.StartConversationDto = StartConversationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StartConversationDto.prototype, "otherUserId", void 0);
class MarkReadDto {
    messageIds;
}
exports.MarkReadDto = MarkReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['msg-1', 'msg-2'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MarkReadDto.prototype, "messageIds", void 0);
class CursorQueryDto {
    cursor;
    limit;
}
exports.CursorQueryDto = CursorQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-17T12:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CursorQueryDto.prototype, "cursor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CursorQueryDto.prototype, "limit", void 0);
class MessageDto {
    id;
    conversationId;
    senderId;
    content;
    contentType;
    mediaRef;
    readAt;
    createdAt;
}
exports.MessageDto = MessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], MessageDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], MessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], MessageDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello' }),
    __metadata("design:type", String)
], MessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'text' }),
    __metadata("design:type", String)
], MessageDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], MessageDto.prototype, "mediaRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], MessageDto.prototype, "readAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", Date)
], MessageDto.prototype, "createdAt", void 0);
class ConversationSummaryDto {
    id;
    otherUserId;
    lastMessage;
    unreadCount;
    updatedAt;
}
exports.ConversationSummaryDto = ConversationSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], ConversationSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], ConversationSummaryDto.prototype, "otherUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ConversationSummaryDto.prototype, "lastMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], ConversationSummaryDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", Date)
], ConversationSummaryDto.prototype, "updatedAt", void 0);
class ConversationDetailDto {
    id;
    userAId;
    userBId;
    status;
    createdAt;
}
exports.ConversationDetailDto = ConversationDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], ConversationDetailDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], ConversationDetailDto.prototype, "userAId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], ConversationDetailDto.prototype, "userBId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active' }),
    __metadata("design:type", String)
], ConversationDetailDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-17T12:00:00.000Z' }),
    __metadata("design:type", Date)
], ConversationDetailDto.prototype, "createdAt", void 0);
class MessagesPageDto {
    items;
    nextCursor;
    hasMore;
}
exports.MessagesPageDto = MessagesPageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MessageDto] }),
    __metadata("design:type", Array)
], MessagesPageDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cursor-string' }),
    __metadata("design:type", String)
], MessagesPageDto.prototype, "nextCursor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], MessagesPageDto.prototype, "hasMore", void 0);
//# sourceMappingURL=chat.dto.js.map