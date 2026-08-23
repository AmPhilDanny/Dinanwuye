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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfilesService = class ProfilesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [profiles, total] = await this.prisma.$queryRaw `
      SELECT id, userId, name, dob, gender, seeking, isVerified, isActive, isPremium, lastActiveAt, onboardingStep, onboardingComplete, createdAt, updatedAt
      FROM "Profile"
      ORDER BY createdAt DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
        const totalCount = await this.prisma.profile.count();
        return { profiles, total: totalCount };
    }
    async findOne(id) {
        const profile = await this.prisma.profile.findUnique({
            where: { id },
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Profile with ID ${id} not found`);
        }
        return profile;
    }
    async create(createProfileDto) {
        const profile = await this.prisma.profile.create({
            data: createProfileDto,
        });
        return profile;
    }
    async update(id, updateProfileDto) {
        const profile = await this.prisma.profile.update({
            where: { id },
            data: updateProfileDto,
        });
        return profile;
    }
    async remove(id) {
        await this.prisma.profile.delete({
            where: { id },
        });
        return { message: `Profile ${id} deleted successfully` };
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map