import 'reflect-metadata';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
export declare class PhotosController {
    private readonly photosService;
    constructor(photosService: PhotosService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createPhotoDto: CreatePhotoDto): Promise<any>;
    update(id: string, updatePhotoDto: UpdatePhotoDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=photos.controller.d.ts.map