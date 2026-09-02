"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapService = bootstrapService;
/**
 * @dinanwuye/shared — service bootstrap helper.
 * Wraps NestFactory with Swagger, global validation pipe, CORS and shutdown hooks
 * so each service's main.ts is only a few lines.
 */
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path_1 = require("path");
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
async function bootstrapService(appModule, options) {
    const logger = new common_1.Logger(options.serviceName);
    const app = await core_1.NestFactory.create(appModule, {
        logger: ['log', 'warn', 'error'],
    });
    app.setGlobalPrefix(constants_1.API_PREFIX);
    app.enableShutdownHooks();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const corsOrigins = options.corsOrigins ?? ['http://localhost:8100', 'https://dinanwuye.com', 'https://www.dinanwuye.com'];
    app.enableCors({
        origin: corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    if (options.swaggerEnabled !== false) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle(options.serviceName)
            .setDescription(options.description ?? `${options.serviceName} API`)
            .setVersion(options.version)
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
    const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads', 'photos');
    if (!(0, fs_1.existsSync)(uploadsDir)) {
        (0, fs_1.mkdirSync)(uploadsDir, { recursive: true });
    }
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use('/uploads/photos', express_1.default.static(uploadsDir));
    await app.listen(options.port);
    logger.log(`🚀 ${options.serviceName} v${options.version} listening on :${options.port}`);
    return app;
}
//# sourceMappingURL=bootstrap.js.map