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
const shared_1 = require("@dinanwuye/shared");
const prisma_module_1 = require("./prisma/prisma.module");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const safety_controller_1 = require("./safety/safety.controller");
const safety_service_1 = require("./safety/safety.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET') ?? 'insecure-dev-secret',
                }),
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            prisma_module_1.PrismaModule,
        ],
        controllers: [shared_1.HealthController, safety_controller_1.SafetyController],
        providers: [
            safety_service_1.SafetyService,
            jwt_strategy_1.JwtStrategy,
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: shared_1.SERVICE_NAME_TOKEN, useValue: 'trust-safety-service' },
            { provide: shared_1.SERVICE_VERSION_TOKEN, useValue: '0.1.0' },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map