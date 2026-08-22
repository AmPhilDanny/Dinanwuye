"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const shared_1 = require("@dinanwuye/shared");
const app_module_1 = require("./app.module");
const shared_2 = require("@dinanwuye/shared");
async function main() {
    await (0, shared_1.bootstrapService)(app_module_1.AppModule, {
        serviceName: 'auth-service',
        version: '0.1.0',
        description: 'Dinanwuye Auth & Identity Service',
        port: Number(process.env.AUTH_SERVICE_PORT ?? shared_2.PORTS.AUTH),
        corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8100').split(','),
    });
}
void main();
//# sourceMappingURL=main.js.map