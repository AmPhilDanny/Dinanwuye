"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const shared_1 = require("@dinanwuye/shared");
const app_module_1 = require("./app.module");
const shared_2 = require("@dinanwuye/shared");
async function main() {
    await (0, shared_1.bootstrapService)(app_module_1.AppModule, {
        serviceName: 'messaging-service',
        version: '0.1.0',
        description: 'Dinanwuye Messaging Service (REST + Socket.IO on the same HTTP port)',
        port: Number(process.env.PORT ?? process.env.MESSAGING_SERVICE_PORT ?? shared_2.PORTS.MESSAGING),
        corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8100').split(','),
    });
}
void main();
//# sourceMappingURL=main.js.map