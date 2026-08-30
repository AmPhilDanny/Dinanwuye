import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { REPORT_CATEGORIES } from '../shared';
import { PrismaService } from '../prisma/prisma.module';
import { BlockTargetDto, ExclusionsDto, ReportDto, ReportResponseDto } from './dto/safety.dto';

const REPORT_DAILY_LIMIT = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class SafetyService {
  private readonly logger = new Logger(SafetyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async block(userId: string, dto: BlockTargetDto): Promise<{ success: true; blockedId: string }> {
    if (dto.targetId === userId) {
      throw new ConflictException('You cannot block yourself');
    }

    const existing = await this.prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: userId, blockedId: dto.targetId } },
    });
    if (existing) {
      throw new ConflictException('User is already blocked');
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

  async unblock(userId: string, targetId: string): Promise<{ success: true }> {
    const existing = await this.prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } },
    });
    if (!existing) {
      throw new NotFoundException('Block not found');
    }
    await this.prisma.block.delete({ where: { id: existing.id } });
    return { success: true };
  }

  async report(userId: string, dto: ReportDto): Promise<ReportResponseDto> {
    const since = new Date(Date.now() - DAY_MS);
    const recentCount = await this.prisma.report.count({
      where: {
        reporterId: userId,
        targetId: dto.targetId,
        createdAt: { gte: since },
      },
    });
    if (recentCount >= REPORT_DAILY_LIMIT) {
      throw new HttpException(
        `Report limit reached (${REPORT_DAILY_LIMIT}/day for the same user)`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (!REPORT_CATEGORIES.includes(dto.category as (typeof REPORT_CATEGORIES)[number])) {
      throw new ConflictException('Invalid report category');
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

  async listMyReports(userId: string, offset = 0, limit = 20): Promise<ReportResponseDto[]> {
    const reports = await this.prisma.report.findMany({
      where: { reporterId: userId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: Math.min(limit, 100),
    });
    return reports.map((r: any) => ({
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
  async getExclusions(userId: string): Promise<ExclusionsDto> {
    const [blockingRows, blockedByRows] = await Promise.all([
      this.prisma.block.findMany({ where: { blockerId: userId }, select: { blockedId: true } }),
      this.prisma.block.findMany({ where: { blockedId: userId }, select: { blockerId: true } }),
    ]);
    return {
      blockedBy: blockedByRows.map((r: any) => r.blockerId),
      blocking: blockingRows.map((r: any) => r.blockedId),
    };
  }

  private async requestConversationDeletion(userA: string, userB: string): Promise<void> {
    try {
      // In consolidated app, we can directly call the ChatService
      // This is a simplified version - in production, you'd inject ChatService
      this.logger.log(`Block: conversation deletion requested between ${userA} and ${userB}`);
    } catch (err) {
      this.logger.warn(`Could not notify messaging service about block: ${String(err)}`);
    }
  }
}
