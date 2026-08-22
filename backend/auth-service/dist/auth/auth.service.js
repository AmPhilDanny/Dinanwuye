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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const shared_1 = require("@dinanwuye/shared");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_module_1 = require("../prisma/prisma.module");
const otp_service_1 = require("../otp/otp.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    otp;
    constructor(prisma, jwt, config, otp) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.otp = otp;
    }
    async signup(dto) {
        if (!dto.email && !dto.phone) {
            throw new common_1.ConflictException('Provide at least an email or a phone number');
        }
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email ?? null }, { phone: dto.phone ?? null }],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('An account with this email or phone already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                emailHash: dto.email ? this.hashIdentifier(dto.email) : null,
                phoneHash: dto.phone ? this.hashIdentifier(dto.phone) : null,
                passwordHash,
                status: 'active',
                role: 'user',
            },
        });
        // Phone signups start an OTP verification flow (delivery is a V0 stub).
        if (dto.phone) {
            await this.otp.send(dto.phone, 'signup', user.id);
        }
        const tokens = await this.issueTokens(user.id, user.email, user.phone, user.role, user.status);
        return { userId: user.id, email: user.email ?? undefined, phone: user.phone ?? undefined, ...tokens, isNewUser: true };
    }
    async login(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.identifier }, { phone: dto.identifier }, { emailHash: this.hashIdentifier(dto.identifier) }],
            },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        const tokens = await this.issueTokens(user.id, user.email, user.phone, user.role, user.status);
        return { userId: user.id, email: user.email ?? undefined, phone: user.phone ?? undefined, ...tokens, isNewUser: false };
    }
    async verifyOtp(dto) {
        const { userId } = await this.otp.verify(dto.identifier, dto.code, dto.purpose);
        if (!userId) {
            throw new common_1.UnauthorizedException('Code is not associated with an account');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        // Signup-purpose OTP confirms the phone — mark verified.
        if (dto.purpose === 'signup' && !user.isVerified) {
            await this.prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
        }
        const tokens = await this.issueTokens(user.id, user.email, user.phone, user.role, user.status);
        return { userId: user.id, email: user.email ?? undefined, phone: user.phone ?? undefined, ...tokens, isNewUser: false };
    }
    async refresh(dto) {
        let payload;
        try {
            payload = this.jwt.verify(dto.refreshToken, {
                secret: this.config.get('JWT_SECRET') ?? 'insecure-dev-secret',
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (!payload.jti) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const stored = await this.prisma.refreshToken.findUnique({ where: { jti: payload.jti } });
        if (!stored || stored.revokedAt || stored.expiresAt.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Refresh token has been revoked or expired');
        }
        // Rotate: revoke the old jti, issue a fresh pair.
        await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
        const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        return this.issueTokens(user.id, user.email, user.phone, user.role, user.status);
    }
    async logout(userId, dto) {
        let payload;
        try {
            payload = this.jwt.verify(dto.refreshToken, {
                secret: this.config.get('JWT_SECRET') ?? 'insecure-dev-secret',
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (payload.jti) {
            await this.prisma.refreshToken.updateMany({
                where: { jti: payload.jti, userId },
                data: { revokedAt: new Date() },
            });
        }
        return { success: true };
    }
    async issueTokens(userId, email, phone, role, status) {
        const secret = this.config.get('JWT_SECRET') ?? 'insecure-dev-secret';
        const accessToken = this.jwt.sign({ sub: userId, email: email ?? undefined, phone: phone ?? undefined, role, status }, { secret, expiresIn: shared_1.JWT_EXPIRES_IN });
        const jti = (0, crypto_1.randomUUID)();
        const refreshToken = this.jwt.sign({ sub: userId, role, status, jti }, { secret, expiresIn: shared_1.JWT_REFRESH_EXPIRES_IN });
        await this.prisma.refreshToken.create({
            data: {
                userId,
                jti,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return { accessToken, refreshToken };
    }
    hashIdentifier(value) {
        return (0, crypto_1.createHash)('sha256').update(value.trim().toLowerCase()).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        otp_service_1.OtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map