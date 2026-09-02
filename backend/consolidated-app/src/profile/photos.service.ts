import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { PhotoDto } from './dto/profile.dto';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

const MAX_PHOTOS = 1;
const UPLOADS_DIR = join(process.cwd(), 'uploads', 'photos');
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async addPhoto(userId: string, file: UploadFile, order: number = 0): Promise<PhotoDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException('Photo must be jpeg, png, or webp');
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException('Photo must be under 10 MB');
    }

    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found — GET /profiles/me first');
    }

    if (!existsSync(UPLOADS_DIR)) {
      mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const ext = file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    const filePath = join(UPLOADS_DIR, filename);
    writeFileSync(filePath, file.buffer);

    const photo = await this.prisma.$transaction(async (tx: any) => {
      const existing = await tx.photo.findMany({ where: { profileId: profile.id } });
      for (const p of existing) {
        const oldFile = join(UPLOADS_DIR, p.s3Key);
        if (existsSync(oldFile)) unlinkSync(oldFile);
      }
      await tx.photo.deleteMany({ where: { profileId: profile.id } });
      return tx.photo.create({
        data: {
          profileId: profile.id,
          s3Key: filename,
          order,
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

    const filePath = join(UPLOADS_DIR, photo.s3Key);
    if (existsSync(filePath)) unlinkSync(filePath);
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
