import 'reflect-metadata';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
export declare class PhotosController {
    private readonly photosService;
    constructor(photosService: PhotosService);
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
    create(createPhotoDto: CreatePhotoDto): Promise<{
        id: string;
        createdAt: Date;
        profileId: string;
        s3Key: string;
        order: number;
        moderationStatus: string;
    }>;
    update(id: string, updatePhotoDto: UpdatePhotoDto): Promise<{
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
//# sourceMappingURL=photos.controller.d.ts.map