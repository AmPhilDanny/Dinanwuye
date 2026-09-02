import { PrismaService } from '../prisma/prisma.module';
import { CreatePhotoDto, PhotoDto } from './dto/profile.dto';
export declare class PhotosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addPhoto(userId: string, dto: CreatePhotoDto): Promise<PhotoDto>;
    removePhoto(userId: string, photoId: string): Promise<{
        success: true;
    }>;
    listPhotos(userId: string): Promise<PhotoDto[]>;
}
//# sourceMappingURL=photos.service.d.ts.map