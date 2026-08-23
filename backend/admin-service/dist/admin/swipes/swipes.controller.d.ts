import 'reflect-metadata';
import { SwipesService } from './swipes.service';
export declare class SwipesController {
    private readonly swipesService;
    constructor(swipesService: SwipesService);
    findAll(page?: number, limit?: number): Promise<{
        swipes: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=swipes.controller.d.ts.map