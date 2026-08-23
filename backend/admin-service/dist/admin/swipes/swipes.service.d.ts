import 'reflect-metadata';
import { PrismaService } from '../prisma/prisma.service';
export declare class SwipesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        swipes: any;
        total: any;
    }>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=swipes.service.d.ts.map