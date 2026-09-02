"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const throttler_1 = require("@nestjs/throttler");
const shared_1 = require("./shared");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const profile_module_1 = require("./profile/profile.module");
const messaging_module_1 = require("./messaging/messaging.module");
const admin_module_1 = require("./admin/admin.module");
const trust_safety_module_1 = require("./trust-safety/trust-safety.module");
const notification_module_1 = require("./notification/notification.module");
const payment_module_1 = require("./payment/payment.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Global configuration
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
            // Rate limiting
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
            // JWT authentication
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET') ?? 'insecure-dev-secret',
                }),
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            // Database
            prisma_module_1.PrismaModule,
            // Feature modules
            auth_module_1.AuthModule,
            profile_module_1.ProfileModule,
            messaging_module_1.MessagingModule,
            admin_module_1.AdminModule,
            trust_safety_module_1.TrustSafetyModule,
            notification_module_1.NotificationModule,
            payment_module_1.PaymentModule,
        ],
        controllers: [shared_1.HealthController],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: shared_1.SERVICE_NAME_TOKEN, useValue: 'dinanwuye-api' },
            { provide: shared_1.SERVICE_VERSION_TOKEN, useValue: '0.1.0' },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map