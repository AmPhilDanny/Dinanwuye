import 'reflect-metadata';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dto/update-match.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    findAll(page?: number, limit?: number): Promise<{
        matches: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateMatchDto: UpdateMatchDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=matches.controller.d.ts.map