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
exports.UsersService = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [users, total] = await this.prisma.$queryRaw `
      SELECT id, email, phone, status, role, isVerified, createdAt, updatedAt
      FROM "User"
      ORDER BY createdAt DESC
      OFFSET ${skip} LIMIT ${limit}
    `;
        const totalCount = await this.prisma.user.count();
        return { users, total: totalCount };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async create(createUserDto) {
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                passwordHash: createUserDto.passwordHash,
                role: createUserDto.role || 'user',
                status: 'active',
            },
        });
        const { passwordHash, ...result } = user;
        return result;
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                email: updateUserDto.email,
                role: updateUserDto.role,
                ...(updateUserDto.isActive === undefined ? {} : { status: updateUserDto.isActive ? 'active' : 'suspended' }),
            },
        });
        const { passwordHash, ...result } = user;
        return result;
    }
    async remove(id) {
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: `User ${id} deleted successfully` };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map