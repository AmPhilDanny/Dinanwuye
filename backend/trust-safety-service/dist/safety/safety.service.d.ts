import { PrismaService } from '../prisma/prisma.module';
import { BlockTargetDto, ExclusionsDto, ReportDto, ReportResponseDto } from './dto/safety.dto';
export declare class SafetyService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    block(userId: string, dto: BlockTargetDto): Promise<{
        success: true;
        blockedId: string;
    }>;
    unblock(userId: string, targetId: string): Promise<{
        success: true;
    }>;
    report(userId: string, dto: ReportDto): Promise<ReportResponseDto>;
    listMyReports(userId: string, offset?: number, limit?: number): Promise<ReportResponseDto[]>;
    /**
     * Exclusion lists for the matching service.
     * EXACT contract: { blockedBy: string[], blocking: string[] } — do not rename.
     */
    getExclusions(userId: string): Promise<ExclusionsDto>;
    private requestConversationDeletion;
}
//# sourceMappingURL=safety.service.d.ts.map