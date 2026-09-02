import { PrismaService } from '../prisma/prisma.module';
import { PhotoDto } from './dto/profile.dto';
interface UploadFile {
    buffer: Buffer;
    mimetype: string;
    size: number;
}
export declare class PhotosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addPhoto(userId: string, file: UploadFile, order?: number): Promise<PhotoDto>;
    removePhoto(userId: string, photoId: string): Promise<{
        success: true;
    }>;
    listPhotos(userId: string): Promise<PhotoDto[]>;
}
export {};
//# sourceMappingURL=photos.service.d.ts.map