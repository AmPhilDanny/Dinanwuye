import 'reflect-metadata';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PhotosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        profile: {
            id: string;
            name: string;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        profileId: string;
        s3Key: string;
        order: number;
        moderationStatus: string;
    })[]>;
    findOne(id: string): Promise<{
        profile: {
            id: string;
            name: string;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        profileId: string;
        s3Key: string;
        order: number;
        moderationStatus: string;
    }>;
    create(createPhotoDto: {
        profileId: string;
        s3Key: string;
        order?: number;
        moderationStatus?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        profileId: string;
        s3Key: string;
        order: number;
        moderationStatus: string;
    }>;
    update(id: string, updatePhotoDto: {
        order?: number;
        moderationStatus?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        profileId: string;
        s3Key: string;
        order: number;
        moderationStatus: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=photos.service.d.ts.map