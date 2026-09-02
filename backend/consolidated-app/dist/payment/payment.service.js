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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../prisma/prisma.module");
let PaymentService = PaymentService_1 = class PaymentService {
    prisma;
    config;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async getSubscription(userId) {
        return this.prisma.subscription.findUnique({
            where: { userId },
        });
    }
    async createCheckout(userId, planId, provider) {
        // V0: log checkout - real payment integration in Phase 2
        this.logger.log(`[CHECKOUT STUB] User ${userId} wants ${planId} via ${provider}`);
        return {
            checkoutUrl: `https://checkout.${provider}.com/demo`,
            sessionId: `session_${Date.now()}`,
        };
    }
    async handleWebhook(provider, payload) {
        // V0: log webhook - real handling in Phase 2
        this.logger.log(`[WEBHOOK STUB] ${provider}: ${JSON.stringify(payload)}`);
        return { received: true };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map