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
exports.UsersService = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [users, total] = await this.prisma.$queryRaw `
      SELECT id, email, phone, status, role, isVerified, createdAt, updatedAt
      FROM "AdminUser"
      ORDER BY createdAt DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
        const totalCount = await this.prisma.adminUser.count();
        return { users, total: totalCount };
    }
    async findOne(id) {
        const user = await this.prisma.adminUser.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async create(createUserDto) {
        const user = await this.prisma.adminUser.create({
            data: {
                email: createUserDto.email,
                name: createUserDto.name,
                passwordHash: createUserDto.passwordHash,
                role: createUserDto.role || 'admin',
                isActive: true,
            },
        });
        const { passwordHash, ...result } = user;
        return result;
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.adminUser.update({
            where: { id },
            data: updateUserDto,
        });
        const { passwordHash, ...result } = updateUserDto;
        return result;
    }
    async remove(id) {
        await this.prisma.adminUser.delete({
            where: { id },
        });
        return { message: `User ${id} deleted successfully` };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);
//# sourceMappingURL=users.service.js.map