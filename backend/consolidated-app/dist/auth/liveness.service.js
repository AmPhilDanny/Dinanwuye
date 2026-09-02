"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivenessService = exports.LIVENESS_ACTIONS = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
exports.LIVENESS_ACTIONS = ['blink', 'open_mouth', 'smile', 'turn_head'];
let LivenessService = class LivenessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createChallenge() {
        return [...exports.LIVENESS_ACTIONS].sort(() => Math.random() - 0.5).slice(0, 2);
    }
    async recordResult(userId, challenges, completed, confidence, deviceRef) {
        const validChallenges = challenges.filter((action) => exports.LIVENESS_ACTIONS.includes(action));
        const validCompleted = completed.filter((action) => exports.LIVENESS_ACTIONS.includes(action));
        if (validChallenges.length < 2 || validChallenges.length !== challenges.length) {
            throw new common_1.BadRequestException('A valid liveness challenge must contain at least two actions');
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
};
exports.LivenessService = LivenessService;
exports.LivenessService = LivenessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService])
], LivenessService);
//# sourceMappingURL=liveness.service.js.map