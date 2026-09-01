import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';

export const LIVENESS_ACTIONS = ['blink', 'open_mouth', 'smile', 'turn_head'] as const;
export type LivenessAction = (typeof LIVENESS_ACTIONS)[number];

@Injectable()
export class LivenessService {
  constructor(private readonly prisma: PrismaService) {}

  createChallenge(): LivenessAction[] {
    return [...LIVENESS_ACTIONS].sort(() => Math.random() - 0.5).slice(0, 2);
  }

  async recordResult(userId: string, challenges: string[], completed: string[], confidence?: number, deviceRef?: string) {
    const validChallenges = challenges.filter((action): action is LivenessAction => LIVENESS_ACTIONS.includes(action as LivenessAction));
    const validCompleted = completed.filter((action): action is LivenessAction => LIVENESS_ACTIONS.includes(action as LivenessAction));
    if (validChallenges.length < 2 || validChallenges.length !== challenges.length) {
      throw new BadRequestException('A valid liveness challenge must contain at least two actions');
    }

    const passed = validChallenges.every((action) => validCompleted.includes(action));
    const attempt = await this.prisma.livenessAttempt.create({
      data: {
        userId,
        challenges: validChallenges,
        completed: validCompleted,
        passed,
        confidence: confidence === undefined ? undefined : Math.max(0, Math.min(1, confidence)),
        deviceRef,
        failureReason: passed ? null : 'One or more required actions were not completed',
      },
    });

    if (passed) {
      await this.prisma.user.update({ where: { id: userId }, data: { isVerified: true } });
    }

    return { attemptId: attempt.id, passed, challenges: validChallenges };
  }
}
