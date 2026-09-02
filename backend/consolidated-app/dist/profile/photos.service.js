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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
const MAX_PHOTOS = 1;
const UPLOADS_DIR = (0, path_1.join)(process.cwd(), 'uploads', 'photos');
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;
let PhotosService = class PhotosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addPhoto(userId, file, order = 0) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        if (!ALLOWED_MIME.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Photo must be jpeg, png, or webp');
        }
        if (file.size > MAX_BYTES) {
            throw new common_1.BadRequestException('Photo must be under 10 MB');
        }
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found — GET /profiles/me first');
        }
        if (!(0, fs_1.existsSync)(UPLOADS_DIR)) {
            (0, fs_1.mkdirSync)(UPLOADS_DIR, { recursive: true });
        }
        const ext = file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpg';
        const filename = `${(0, crypto_1.randomUUID)()}.${ext}`;
        const filePath = (0, path_1.join)(UPLOADS_DIR, filename);
        (0, fs_1.writeFileSync)(filePath, file.buffer);
        const photo = await this.prisma.$transaction(async (tx) => {
            const existing = await tx.photo.findMany({ where: { profileId: profile.id } });
            for (const p of existing) {
                const oldFile = (0, path_1.join)(UPLOADS_DIR, p.s3Key);
                if ((0, fs_1.existsSync)(oldFile))
                    (0, fs_1.unlinkSync)(oldFile);
            }
            await tx.photo.deleteMany({ where: { profileId: profile.id } });
            return tx.photo.create({
                data: {
                    profileId: profile.id,
                    s3Key: filename,
                    order,
                },
            });
        });
        return {
            id: photo.id,
            s3Key: photo.s3Key,
            order: photo.order,
            moderationStatus: photo.moderationStatus,
        };
    }
    async removePhoto(userId, photoId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const photo = await this.prisma.photo.findFirst({ where: { id: photoId, profileId: profile.id } });
        if (!photo) {
            throw new common_1.NotFoundException('Photo not found');
        }
        const filePath = (0, path_1.join)(UPLOADS_DIR, photo.s3Key);
        if ((0, fs_1.existsSync)(filePath))
            (0, fs_1.unlinkSync)(filePath);
        await this.prisma.photo.delete({ where: { id: photoId } });
        return { success: true };
    }
    async listPhotos(userId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile) {
            return [];
        }
        const photos = await this.prisma.photo.findMany({
            where: { profileId: profile.id },
            orderBy: { order: 'asc' },
        });
        return photos.map((p) => ({
            id: p.id,
            s3Key: p.s3Key,
            order: p.order,
            moderationStatus: p.moderationStatus,
        }));
    }
};
exports.PhotosService = PhotosService;
exports.PhotosService = PhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService])
], PhotosService);
//# sourceMappingURL=photos.service.js.map