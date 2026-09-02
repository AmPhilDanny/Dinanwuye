import { OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleDestroy {
    onModuleDestroy(): Promise<void>;
}
export declare class PrismaModule {
}
//# sourceMappingURL=prisma.module.d.ts.map