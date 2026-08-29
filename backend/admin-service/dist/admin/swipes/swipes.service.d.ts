import 'reflect-metadata';
import { PrismaService } from '../../prisma/prisma.service';
import { Swipe } from '../../common/types';
export declare class SwipesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        swipes: Swipe;
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
//# sourceMappingURL=swipes.service.d.ts.map