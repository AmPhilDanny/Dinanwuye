import type { JwtRequest } from '../shared';
import { SafetyService } from './safety.service';
import { BlockTargetDto, ExclusionsDto, ReportDto, ReportQueryDto, ReportResponseDto } from './dto/safety.dto';
export declare class SafetyController {
    private readonly safety;
    constructor(safety: SafetyService);
    block(request: JwtRequest, dto: BlockTargetDto): Promise<{
        success: true;
        blockedId: string;
    }>;
    unblock(request: JwtRequest, targetId: string): Promise<{
        success: true;
    }>;
    report(request: JwtRequest, dto: ReportDto): Promise<ReportResponseDto>;
    listReports(request: JwtRequest, query: ReportQueryDto): Promise<ReportResponseDto[]>;
    getExclusions(request: JwtRequest): Promise<ExclusionsDto>;
}
//# sourceMappingURL=safety.controller.d.ts.map