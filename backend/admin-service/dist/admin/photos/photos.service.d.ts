import 'reflect-metadata';
import { PrismaService } from '../prisma/prisma.service';
export declare class PhotosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createPhotoDto: {
        profileId: string;
        s3Key: string;
        order?: number;
        moderationStatus?: string;
    }): Promise<any>;
    update(id: string, updatePhotoDto: {
        order?: number;
        moderationStatus?: string;
    }): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=photos.service.d.ts.map