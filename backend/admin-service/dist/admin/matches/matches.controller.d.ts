import 'reflect-metadata';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dto/update-match.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    findAll(page?: number, limit?: number): Promise<{
        matches: import("../../common/types").Match;
        total: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        userAId: string;
        userBId: string;
    }>;
    update(id: string, updateMatchDto: UpdateMatchDto): Promise<{
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
//# sourceMappingURL=matches.controller.d.ts.map