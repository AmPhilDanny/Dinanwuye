import { PrismaService } from '../prisma/prisma.module';
export declare const LIVENESS_ACTIONS: readonly ["blink", "open_mouth", "smile", "turn_head"];
export type LivenessAction = (typeof LIVENESS_ACTIONS)[number];
export declare class LivenessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createChallenge(): LivenessAction[];
    recordResult(userId: string, challenges: string[], completed: string[], confidence?: number, deviceRef?: string): Promise<{
        attemptId: string;
        passed: boolean;
        challenges: ("blink" | "open_mouth" | "smile" | "turn_head")[];
    }>;
}
//# sourceMappingURL=liveness.service.d.ts.map