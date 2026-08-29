import 'reflect-metadata';
import { SwipesService } from './swipes.service';
export declare class SwipesController {
    private readonly swipesService;
    constructor(swipesService: SwipesService);
    findAll(page?: number, limit?: number): Promise<{
        swipes: import("../../common/types").Swipe;
        total: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        actorId: string;
        targetId: string;
        action: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=swipes.controller.d.ts.map