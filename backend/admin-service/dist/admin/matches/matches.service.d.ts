import 'reflect-metadata';
import { PrismaService } from '../../prisma/prisma.service';
import { Match } from '../../common/types';
export declare class MatchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        matches: Match;
        total: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        userAId: string;
        userBId: string;
    }>;
    update(id: string, updateMatchDto: {
        status?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        userAId: string;
        userBId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=matches.service.d.ts.map