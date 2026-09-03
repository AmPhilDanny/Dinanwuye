import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.module';
import { PhotoDto } from './dto/profile.dto';
interface UploadFile {
    buffer: Buffer;
    mimetype: string;
    size: number;
}
export declare class PhotosService {
    private readonly prisma;
    private readonly config;
    private readonly supabaseUrl;
    private readonly serviceKey;
    private readonly publicBase;
    constructor(prisma: PrismaService, config: ConfigService);
    private uploadToSupabase;
    private deleteFromSupabase;
    private buildPublicUrl;
    addPhoto(userId: string, file: UploadFile, order?: number): Promise<PhotoDto>;
    removePhoto(userId: string, photoId: string): Promise<{
        success: true;
    }>;
    listPhotos(userId: string): Promise<PhotoDto[]>;
    getPublicUrl(storagePath: string): string;
}
export {};
//# sourceMappingURL=photos.service.d.ts.map