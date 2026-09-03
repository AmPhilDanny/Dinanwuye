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
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../prisma/prisma.module");
const crypto_1 = require("crypto");
const MAX_PHOTOS = 1;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;
const BUCKET = 'profile-photos';
let PhotosService = class PhotosService {
    prisma;
    config;
    supabaseUrl;
    serviceKey;
    publicBase;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.supabaseUrl = this.config.get('SUPABASE_URL') || 'https://ysvqvrskwyyjbeepbyuc.supabase.co';
        this.serviceKey = this.config.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        this.publicBase = `${this.supabaseUrl}/storage/v1/object/public/${BUCKET}`;
    }
    async uploadToSupabase(path, buffer, mimetype) {
        const url = `${this.supabaseUrl}/storage/v1/object/${BUCKET}/${path}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.serviceKey}`,
                'Content-Type': mimetype,
                'x-upsert': 'true',
            },
            body: buffer,
        });
        if (!res.ok) {
            const err = await res.text();
            throw new common_1.BadRequestException(`Supabase upload failed: ${err}`);
        }
    }
    async deleteFromSupabase(path) {
        const url = `${this.supabaseUrl}/storage/v1/object/${BUCKET}/${path}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${this.serviceKey}` },
        });
        if (!res.ok && res.status !== 404) {
            const err = await res.text();
            throw new common_1.BadRequestException(`Supabase delete failed: ${err}`);
        }
    }
    buildPublicUrl(path) {
        return `${this.publicBase}/${encodeURIComponent(path)}`;
    }
    async addPhoto(userId, file, order = 0) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!ALLOWED_MIME.includes(file.mimetype))
            throw new common_1.BadRequestException('Photo must be jpeg, png, or webp');
        if (file.size > MAX_BYTES)
            throw new common_1.BadRequestException('Photo must be under 10 MB');
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found — GET /profiles/me first');
        const ext = file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpg';
        const filename = `${(0, crypto_1.randomUUID)()}.${ext}`;
        const storagePath = `${userId}/${filename}`;
        await this.uploadToSupabase(storagePath, file.buffer, file.mimetype);
        const photo = await this.prisma.$transaction(async (tx) => {
            const existing = await tx.photo.findMany({ where: { profileId: profile.id } });
            for (const p of existing) {
                await this.deleteFromSupabase(p.s3Key);
            }
            await tx.photo.deleteMany({ where: { profileId: profile.id } });
            return tx.photo.create({
                data: { profileId: profile.id, s3Key: storagePath, order },
            });
        });
        return { id: photo.id, s3Key: photo.s3Key, order: photo.order, moderationStatus: photo.moderationStatus };
    }
    async removePhoto(userId, photoId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        const photo = await this.prisma.photo.findFirst({ where: { id: photoId, profileId: profile.id } });
        if (!photo)
            throw new common_1.NotFoundException('Photo not found');
        await this.deleteFromSupabase(photo.s3Key);
        await this.prisma.photo.delete({ where: { id: photoId } });
        return { success: true };
    }
    async listPhotos(userId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            return [];
        const photos = await this.prisma.photo.findMany({ where: { profileId: profile.id }, orderBy: { order: 'asc' } });
        return photos.map((p) => ({ id: p.id, s3Key: p.s3Key, order: p.order, moderationStatus: p.moderationStatus }));
    }
    getPublicUrl(storagePath) {
        if (!storagePath)
            return '';
        if (storagePath.startsWith('http') || storagePath.startsWith('data:'))
            return storagePath;
        return this.buildPublicUrl(storagePath);
    }
};
exports.PhotosService = PhotosService;
exports.PhotosService = PhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_module_1.PrismaService,
        config_1.ConfigService])
], PhotosService);
//# sourceMappingURL=photos.service.js.map