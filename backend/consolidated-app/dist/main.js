"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const shared_1 = require("./shared");
const app_module_1 = require("./app.module");
async function main() {
    await (0, shared_1.bootstrapService)(app_module_1.AppModule, {
        serviceName: 'dinanwuye-api',
        version: '0.1.0',
        description: 'Dinanwuye Consolidated Backend API',
        port: Number(process.env.PORT ?? 3000),
        corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8100,http://localhost:5173,https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com').split(','),
    });
}
void main();
//# sourceMappingURL=main.js.map