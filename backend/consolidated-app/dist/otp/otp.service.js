"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpInvalidException = exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const shared_1 = require("../shared");
const bcrypt = __importStar(require("bcrypt"));
let OtpService = OtpService_1 = class OtpService {
    prisma;
    logger = new common_1.Logger(OtpService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Generate a 6-digit OTP, store a bcrypt hash in the DB and log it.
     * Real SMTP/SMS delivery is a Phase 2 task — V0 logs the code so dev flows work.
     */
    async send(identifier, purpose, userId) {
        // Resend cooldown: reuse the most recent unconsumed code if still fresh.
        const recent = await this.prisma.otpCode.findFirst({
            where: { identifier, purpose, consumedAt: null },
            orderBy: { createdAt: 'desc' },
        });
        if (recent) {
            const elapsedSeconds = (Date.now() - recent.createdAt.getTime()) / 1000;
            if (elapsedSeconds < shared_1.OTP_RESEND_COOLDOWN_SECONDS) {
                return { retryAfterSeconds: Math.ceil(shared_1.OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds) };
            }
            // Expired but unconsumed — revoke so only the newest code is valid.
            await this.prisma.otpCode.updateMany({
                where: { id: recent.id },
                data: { consumedAt: new Date() },
            });
        }
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + shared_1.OTP_TTL_SECONDS * 1000);
        const baseData = {
            identifier,
            codeHash,
            purpose,
            expiresAt,
        };
        await this.prisma.otpCode.create({
            data: userId ? { ...baseData, userId } : baseData,
        });
        // V0 delivery stub — replace with SMTP/SMS provider in Phase 2.
        this.logger.log(`[OTP STUB] ${purpose} code for ${identifier}: ${code} (expires in ${shared_1.OTP_TTL_SECONDS}s)`);
        return { retryAfterSeconds: shared_1.OTP_RESEND_COOLDOWN_SECONDS };
    }
    /**
     * Verify a code: enforce expiry, max-attempts and one-time consumption.
     * Returns the userId the code belongs to (or null for pre-signup verification).
     */
    async verify(identifier, code, purpose) {
        const record = await this.prisma.otpCode.findFirst({
            where: { identifier, purpose, consumedAt: null },
            orderBy: { createdAt: 'desc' },
        });
        if (!record) {
            throw new OtpInvalidException('No active code for this identifier');
        }
        if (record.attempts >= shared_1.OTP_MAX_ATTEMPTS) {
            await this.prisma.otpCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
            throw new OtpInvalidException('Too many attempts — request a new code');
        }
        await this.prisma.otpCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
        if (record.expiresAt.getTime() < Date.now()) {
            throw new OtpInvalidException('Code expired — request a new one');
        }
        const matches = await bcrypt.compare(code, record.codeHash);
        if (!matches) {
            throw new OtpInvalidException('Invalid code');
        }
        await this.prisma.otpCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
        return { userId: record.userId };
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = OtpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService])
], OtpService);
class OtpInvalidException extends Error {
}
exports.OtpInvalidException = OtpInvalidException;
//# sourceMappingURL=otp.service.js.map