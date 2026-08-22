export declare class BlockTargetDto {
    targetId: string;
    reason?: string;
}
export declare class ReportDto {
    targetId: string;
    category: string;
    details?: string;
    contextRef?: string;
}
export declare class ReportQueryDto {
    offset?: number;
    limit?: number;
}
export declare class ExclusionsDto {
    blockedBy: string[];
    blocking: string[];
}
export declare class ReportResponseDto {
    id: string;
    targetId: string;
    category: string;
    details?: string | null;
    status: string;
    createdAt: Date;
}
//# sourceMappingURL=safety.dto.d.ts.map