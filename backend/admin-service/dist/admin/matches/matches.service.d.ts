import 'reflect-metadata';
import { PrismaService } from '../prisma/prisma.service';
export declare class MatchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        matches: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateMatchDto: {
        status?: string;
    }): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=matches.service.d.ts.map