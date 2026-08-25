import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.module';
import { CreatePhotoDto, PhotoDto } from './dto/profile.dto';

const MAX_PHOTOS = 6;

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async addPhoto(userId: string, dto: CreatePhotoDto): Promise<PhotoDto> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found — GET /profiles/me first');
    }

    const count = await this.prisma.photo.count({ where: { profileId: profile.id } });
    if (count >= MAX_PHOTOS) {
      throw new BadRequestException(`Maximum of ${MAX_PHOTOS} photos allowed`);
    }

    const match = dto.dataUrl.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      throw new BadRequestException('Photo must be a jpeg, png, or webp data URL');
    }

    const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
    const key = `uploads/${randomUUID()}.${extension}`;
    const filePath = join(process.cwd(), key);
    await mkdir(join(process.cwd(), 'uploads'), { recursive: true });
    await writeFile(filePath, Buffer.from(match[2], 'base64'));

    const photo = await this.prisma.photo.create({
      data: {
        profileId: profile.id,
        s3Key: key,
        order: dto.order ?? count,
      },
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
    return photos.map((p) => ({
      id: p.id,
      s3Key: p.s3Key,
      order: p.order,
      moderationStatus: p.moderationStatus,
    }));
  }
}