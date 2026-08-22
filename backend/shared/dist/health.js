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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = exports.SERVICE_VERSION_TOKEN = exports.SERVICE_NAME_TOKEN = void 0;
/**
 * @dinanwuye/shared — health controller template reused by each service.
 * Import and register in each service's AppModule to expose GET /health.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
exports.SERVICE_NAME_TOKEN = 'SERVICE_NAME';
exports.SERVICE_VERSION_TOKEN = 'SERVICE_VERSION';
let HealthController = class HealthController {
    serviceName;
    version;
    constructor(serviceName, version) {
        this.serviceName = serviceName;
        this.version = version;
    }
    check() {
        return {
            status: 'healthy',
            service: this.serviceName,
            timestamp: new Date().toISOString(),
            version: this.version,
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Service health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", dto_1.HealthResponseDto)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    __param(0, (0, common_1.Inject)(exports.SERVICE_NAME_TOKEN)),
    __param(1, (0, common_1.Inject)(exports.SERVICE_VERSION_TOKEN)),
    __metadata("design:paramtypes", [String, String])
], HealthController);
//# sourceMappingURL=health.js.map