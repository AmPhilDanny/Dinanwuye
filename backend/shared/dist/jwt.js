"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
exports.getUserFromRequest = getUserFromRequest;
/**
 * @dinanwuye/shared — JWT payload types + Passport JWT guard
 * Reused by every service that needs auth verification.
 */
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
/**
 * Passport JWT guard — verifies Bearer token via jwt-strategy registered
 * in each service's AppModule. Throws 401 when missing/invalid.
 */
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    handleRequest(err, user) {
        if (err || !user) {
            throw err instanceof Error ? err : new common_1.UnauthorizedException('Invalid or expired token');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
/** Helper to pull the JWT payload from a request in controllers/gateways. */
function getUserFromRequest(request) {
    if (!request.user) {
        throw new common_1.UnauthorizedException('Not authenticated');
    }
    return request.user;
}
//# sourceMappingURL=jwt.js.map