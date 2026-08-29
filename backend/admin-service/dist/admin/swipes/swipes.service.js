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
exports.SwipesService = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SwipesService = class SwipesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [swipes, total] = await this.prisma.$queryRaw `
      SELECT id, "actorId" as "actorId", "targetId" as "targetId", action, "createdAt"
      FROM "Swipe"
      ORDER BY "createdAt" DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
        const totalCount = await this.prisma.swipe.count();
        return { swipes, total: totalCount };
    }
    async findOne(id) {
        const swipe = await this.prisma.swipe.findUnique({
            where: { id },
        });
        if (!swipe) {
            throw new common_1.NotFoundException(`Swipe with ID ${id} not found`);
        }
        return swipe;
    }
    async remove(id) {
        await this.prisma.swipe.delete({
            where: { id },
        });
        return { message: `Swipe ${id} deleted successfully` };
    }
};
exports.SwipesService = SwipesService;
exports.SwipesService = SwipesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SwipesService);
//# sourceMappingURL=swipes.service.js.map