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
var SafetyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("../shared");
const prisma_module_1 = require("../prisma/prisma.module");
const REPORT_DAILY_LIMIT = 3;
const DAY_MS = 24 * 60 * 60 * 1000;
let SafetyService = SafetyService_1 = class SafetyService {
    prisma;
    logger = new common_1.Logger(SafetyService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async block(userId, dto) {
        if (dto.targetId === userId) {
            throw new common_1.ConflictException('You cannot block yourself');
        }
        const existing = await this.prisma.block.findUnique({
            where: { blockerId_blockedId: { blockerId: userId, blockedId: dto.targetId } },
        });
        if (existing) {
            throw new common_1.ConflictException('User is already blocked');
        }
        await this.prisma.block.create({
            data: {
                blockerId: userId,
                blockedId: dto.targetId,
                reason: dto.reason,
            },
        });
        // Best-effort: ask the messaging service to delete the conversation.
        // Never blocks the action if the messaging service is unreachable.
        void this.requestConversationDeletion(userId, dto.targetId);
        return { success: true, blockedId: dto.targetId };
    }
    async unblock(userId, targetId) {
        const existing = await this.prisma.block.findUnique({
            where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Block not found');
        }
        await this.prisma.block.delete({ where: { id: existing.id } });
        return { success: true };
    }
    async report(userId, dto) {
        const since = new Date(Date.now() - DAY_MS);
        const recentCount = await this.prisma.report.count({
            where: {
                reporterId: userId,
                targetId: dto.targetId,
                createdAt: { gte: since },
            },
        });
        if (recentCount >= REPORT_DAILY_LIMIT) {
            throw new common_1.HttpException(`Report limit reached (${REPORT_DAILY_LIMIT}/day for the same user)`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        if (!shared_1.REPORT_CATEGORIES.includes(dto.category)) {
            throw new common_1.ConflictException('Invalid report category');
        }
        const report = await this.prisma.report.create({
            data: {
                reporterId: userId,
                targetId: dto.targetId,
                category: dto.category,
                details: dto.details,
                contextRef: dto.contextRef,
            },
        });
        return {
            id: report.id,
            targetId: report.targetId,
            category: report.category,
            details: report.details,
            status: report.status,
            createdAt: report.createdAt,
        };
    }
    async listMyReports(userId, offset = 0, limit = 20) {
        const reports = await this.prisma.report.findMany({
            where: { reporterId: userId },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: Math.min(limit, 100),
        });
        return reports.map((r) => ({
            id: r.id,
            targetId: r.targetId,
            category: r.category,
            details: r.details,
            status: r.status,
            createdAt: r.createdAt,
        }));
    }
    /**
     * Exclusion lists for the matching service.
     * EXACT contract: { blockedBy: string[], blocking: string[] } — do not rename.
     */
    async getExclusions(userId) {
        const [blockingRows, blockedByRows] = await Promise.all([
            this.prisma.block.findMany({ where: { blockerId: userId }, select: { blockedId: true } }),
            this.prisma.block.findMany({ where: { blockedId: userId }, select: { blockerId: true } }),
        ]);
        return {
            blockedBy: blockedByRows.map((r) => r.blockerId),
            blocking: blockingRows.map((r) => r.blockedId),
        };
    }
    async requestConversationDeletion(userA, userB) {
        try {
            // In consolidated app, we can directly call the ChatService
            // This is a simplified version - in production, you'd inject ChatService
            this.logger.log(`Block: conversation deletion requested between ${userA} and ${userB}`);
        }
        catch (err) {
            this.logger.warn(`Could not notify messaging service about block: ${String(err)}`);
        }
    }
};
exports.SafetyService = SafetyService;
exports.SafetyService = SafetyService = SafetyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService])
], SafetyService);
//# sourceMappingURL=safety.service.js.map