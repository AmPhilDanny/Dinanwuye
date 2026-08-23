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
exports.PhotosService = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PhotosService = class PhotosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const photos = await this.prisma.photo.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                profile: {
                    select: { id: true, userId: true, name: true }
                }
            }
        });
        return photos;
    }
    async findOne(id) {
        const photo = await this.prisma.photo.findUnique({
            where: { id },
            include: {
                profile: {
                    select: { id: true, userId: true, name: true }
                }
            }
        });
        if (!photo) {
            throw new common_1.NotFoundException(`Photo with ID ${id} not found`);
        }
        return photo;
    }
    async create(createPhotoDto) {
        const photo = await this.prisma.photo.create({
            data: {
                ...createPhotoDto,
                moderationStatus: createPhotoDto.moderationStatus || 'pending',
            },
        });
        return photo;
    }
    async update(id, updatePhotoDto) {
        const photo = await this.prisma.photo.update({
            where: { id },
            data: updatePhotoDto,
        });
        return photo;
    }
    async remove(id) {
        await this.prisma.photo.delete({
            where: { id },
        });
        return { message: `Photo ${id} deleted successfully` };
    }
};
exports.PhotosService = PhotosService;
exports.PhotosService = PhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PhotosService);
//# sourceMappingURL=photos.service.js.map