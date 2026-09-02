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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_module_1 = require("../prisma/prisma.module");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async login(dto) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { email: dto.email },
        });
        if (!admin || !admin.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, admin.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const secret = this.config.get('JWT_SECRET') ?? 'insecure-dev-secret';
        const accessToken = this.jwt.sign({ sub: admin.id, email: admin.email, role: admin.role }, { secret, expiresIn: '15m' });
        const refreshToken = this.jwt.sign({ sub: admin.id, role: admin.role }, { secret, expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    async getAdmin(adminId) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { id: adminId },
        });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            permissions: admin.permissions,
        };
    }
    async getDashboardStats() {
        const [totalUsers, activeUsers, totalProfiles, pendingPhotos, totalMatches, totalReports, pendingReports] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { status: 'active' } }),
            this.prisma.profile.count(),
            this.prisma.photo.count({ where: { moderationStatus: 'pending' } }),
            this.prisma.match.count(),
            this.prisma.report.count(),
            this.prisma.report.count({ where: { status: 'pending' } }),
        ]);
        return {
            totalUsers,
            activeUsers,
            totalProfiles,
            pendingPhotos,
            totalMatches,
            totalReports,
            pendingReports,
        };
    }
    async getUsers(page = 1, limit = 50, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                    { profile: { name: { contains: search, mode: 'insensitive' } } },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                where,
                include: { profile: { include: { photos: { orderBy: { order: 'asc' }, take: 1 } } } },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users: users.map((u) => ({
                id: u.id,
                email: u.email,
                phone: u.phone,
                status: u.status,
                role: u.role,
                isVerified: u.isVerified,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
                profile: u.profile ? {
                    name: u.profile.name,
                    gender: u.profile.gender,
                    bio: u.profile.bio,
                    ethnicity: u.profile.ethnicity,
                    religion: u.profile.religion,
                    occupation: u.profile.occupation,
                    locationName: u.profile.locationName,
                    isVerified: u.profile.isVerified,
                    isActive: u.profile.isActive,
                    isPremium: u.profile.isPremium,
                    interests: u.profile.interests,
                    languages: u.profile.languages,
                    relationshipIntent: u.profile.relationshipIntent,
                    heightCm: u.profile.heightCm,
                } : null,
                photo: u.profile?.photos?.[0]?.s3Key || null,
            })),
            total,
        };
    }
    async getUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { profile: { include: { photos: { orderBy: { order: 'asc' } } } } },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            status: user.status,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            profile: user.profile ? {
                name: user.profile.name,
                gender: user.profile.gender,
                bio: user.profile.bio,
                ethnicity: user.profile.ethnicity,
                religion: user.profile.religion,
                occupation: user.profile.occupation,
                locationName: user.profile.locationName,
                isVerified: user.profile.isVerified,
                isActive: user.profile.isActive,
                isPremium: user.profile.isPremium,
                interests: user.profile.interests,
                languages: user.profile.languages,
                relationshipIntent: user.profile.relationshipIntent,
                heightCm: user.profile.heightCm,
            } : null,
            photo: user.profile?.photos?.[0]?.s3Key || null,
        };
    }
    async updateUserStatus(id, dto, adminId) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const oldStatus = user.status;
        await this.prisma.user.update({
            where: { id },
            data: { status: dto.status },
        });
        if (dto.status === 'banned' || dto.status === 'suspended') {
            await this.prisma.ban.upsert({
                where: { userId: id },
                create: {
                    userId: id,
                    reason: dto.reason || `Status changed to ${dto.status}`,
                    bannedBy: adminId || 'system',
                    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
                },
                update: {
                    reason: dto.reason || `Status changed to ${dto.status}`,
                    bannedBy: adminId || 'system',
                    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
                    liftedAt: null,
                },
            });
        }
        else if (dto.status === 'active') {
            const ban = await this.prisma.ban.findUnique({ where: { userId: id } });
            if (ban) {
                await this.prisma.ban.update({
                    where: { userId: id },
                    data: { liftedAt: new Date() },
                });
            }
        }
        if (adminId) {
            await this.prisma.auditLog.create({
                data: {
                    adminId,
                    action: 'update',
                    entity: 'User',
                    entityId: id,
                    oldData: { status: oldStatus },
                    newData: { status: dto.status, reason: dto.reason },
                },
            });
        }
        return { success: true };
    }
    async deleteUser(id, adminId) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { profile: { include: { photos: true } } },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const profileId = user.profile?.id;
        await this.prisma.$transaction(async (tx) => {
            if (profileId) {
                await tx.photo.deleteMany({ where: { profileId } });
                await tx.preference.deleteMany({ where: { profileId } });
                await tx.profile.delete({ where: { id: profileId } });
            }
            await tx.refreshToken.deleteMany({ where: { userId: id } });
            await tx.otpCode.deleteMany({ where: { userId: id } });
            await tx.livenessAttempt.deleteMany({ where: { userId: id } });
            await tx.swipe.deleteMany({ where: { OR: [{ actorId: id }, { targetId: id }] } });
            await tx.match.deleteMany({ where: { OR: [{ userAId: id }, { userBId: id }] } });
            await tx.block.deleteMany({ where: { OR: [{ blockerId: id }, { blockedId: id }] } });
            await tx.report.deleteMany({ where: { OR: [{ reporterId: id }, { targetId: id }] } });
            await tx.ban.deleteMany({ where: { userId: id } });
            await tx.conversation.deleteMany({ where: { OR: [{ userAId: id }, { userBId: id }] } });
            await tx.message.deleteMany({ where: { senderId: id } });
            await tx.user.delete({ where: { id } });
        });
        if (adminId) {
            await this.prisma.auditLog.create({
                data: {
                    adminId,
                    action: 'delete',
                    entity: 'User',
                    entityId: id,
                    oldData: { email: user.email, name: user.profile?.name },
                },
            });
        }
        return { success: true };
    }
    async updateUserProfile(id, dto, adminId) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { profile: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        // Update user-level fields
        if (dto.isVerified !== undefined) {
            await this.prisma.user.update({
                where: { id },
                data: { isVerified: dto.isVerified },
            });
        }
        // Update profile fields
        if (user.profile) {
            const profileData = {};
            if (dto.name !== undefined)
                profileData.name = dto.name;
            if (dto.gender !== undefined)
                profileData.gender = dto.gender;
            if (dto.bio !== undefined)
                profileData.bio = dto.bio;
            if (dto.ethnicity !== undefined)
                profileData.ethnicity = dto.ethnicity;
            if (dto.religion !== undefined)
                profileData.religion = dto.religion;
            if (dto.occupation !== undefined)
                profileData.occupation = dto.occupation;
            if (dto.locationName !== undefined)
                profileData.locationName = dto.locationName;
            if (dto.isActive !== undefined)
                profileData.isActive = dto.isActive;
            if (dto.isPremium !== undefined)
                profileData.isPremium = dto.isPremium;
            if (Object.keys(profileData).length > 0) {
                await this.prisma.profile.update({
                    where: { userId: id },
                    data: profileData,
                });
            }
        }
        if (adminId) {
            await this.prisma.auditLog.create({
                data: {
                    adminId,
                    action: 'update',
                    entity: 'Profile',
                    entityId: id,
                    oldData: {},
                    newData: { ...dto },
                },
            });
        }
        return { success: true };
    }
    async getReports(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [reports, total] = await Promise.all([
            this.prisma.report.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    reporter: { select: { id: true, email: true } },
                    target: { select: { id: true, email: true } },
                },
            }),
            this.prisma.report.count(),
        ]);
        return { reports, total };
    }
    async getProfiles(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [profiles, total] = await Promise.all([
            this.prisma.profile.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: true } }),
            this.prisma.profile.count(),
        ]);
        return { profiles, total };
    }
    async getPhotos(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [photos, total] = await Promise.all([
            this.prisma.photo.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { profile: { include: { user: true } } } }),
            this.prisma.photo.count(),
        ]);
        return { photos, total };
    }
    async updatePhotoModeration(id, status, reason, adminId) {
        if (!['approved', 'rejected', 'flagged', 'pending'].includes(status)) {
            throw new common_1.NotFoundException('Invalid moderation status');
        }
        const photo = await this.prisma.photo.findUnique({ where: { id }, include: { profile: { include: { user: true } } } });
        if (!photo) {
            throw new common_1.NotFoundException('Photo not found');
        }
        const oldStatus = photo.moderationStatus;
        const updated = await this.prisma.photo.update({
            where: { id },
            data: {
                moderationStatus: status,
                moderationReason: reason ?? null,
                moderatedAt: new Date(),
            },
        });
        if (adminId) {
            await this.prisma.auditLog.create({
                data: {
                    adminId,
                    action: 'update',
                    entity: 'Photo',
                    entityId: id,
                    oldData: { moderationStatus: oldStatus },
                    newData: { moderationStatus: status, moderationReason: reason ?? null },
                },
            });
        }
        return { id: updated.id, moderationStatus: updated.moderationStatus, moderationReason: updated.moderationReason };
    }
    async getMatches(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [matches, total] = await Promise.all([
            this.prisma.match.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { userA: true, userB: true } }),
            this.prisma.match.count(),
        ]);
        return { matches, total };
    }
    async getAudit(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [entries, total] = await Promise.all([
            this.prisma.auditLog.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { admin: true } }),
            this.prisma.auditLog.count(),
        ]);
        return { entries, total };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AdminService);
//# sourceMappingURL=admin.service.js.map