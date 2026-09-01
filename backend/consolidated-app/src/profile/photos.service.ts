import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { CreatePhotoDto, PhotoDto } from './dto/profile.dto';

const MAX_PHOTOS = 1;

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async addPhoto(userId: string, dto: CreatePhotoDto): Promise<PhotoDto> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found — GET /profiles/me first');
    }

    const count = await this.prisma.photo.count({ where: { profileId: profile.id } });

    const match = dto.dataUrl.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      throw new BadRequestException('Photo must be a jpeg, png, or webp data URL');
    }

    const photo = await this.prisma.$transaction(async (tx: any) => {
      await tx.photo.deleteMany({ where: { profileId: profile.id } });
      return tx.photo.create({
        data: {
          profileId: profile.id,
          s3Key: dto.dataUrl,
          order: 0,
        },
      });
    });

    return {
      id: photo.id,
      s3Key: photo.s3Key,
      order: photo.order,
      moderationStatus: photo.moderationStatus,
    };
  }

  async removePhoto(userId: string, photoId: string): Promise<{ success: true }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const photo = await this.prisma.photo.findFirst({ where: { id: photoId, profileId: profile.id } });
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    await this.prisma.photo.delete({ where: { id: photoId } });
    return { success: true };
  }

  async listPhotos(userId: string): Promise<PhotoDto[]> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return [];
    }
    const photos = await this.prisma.photo.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    });
    return photos.map((p: any) => ({
      id: p.id,
      s3Key: p.s3Key,
      order: p.order,
      moderationStatus: p.moderationStatus,
    }));
  }
}
