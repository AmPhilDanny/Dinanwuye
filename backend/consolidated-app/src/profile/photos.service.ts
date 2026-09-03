import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { PhotoDto } from './dto/profile.dto';
import { randomUUID } from 'crypto';

interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

const MAX_PHOTOS = 1;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;
const BUCKET = 'photos';

const logger = new Logger('PhotosService');

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  private get supabaseUrl(): string | undefined {
    return process.env.SUPABASE_URL || process.env.SUPABASE_STORAGE_URL;
  }

  private get supabaseKey(): string | undefined {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  }

  private get useSupabase(): boolean {
    return !!(this.supabaseUrl && this.supabaseKey);
  }

  private storageUrl(filename: string): string {
    return `${this.supabaseUrl}/storage/v1/object/${BUCKET}/${filename}`;
  }

  private publicUrl(filename: string): string {
    return `${this.supabaseUrl}/storage/v1/object/public/${BUCKET}/${filename}`;
  }

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

    const ext = file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${randomUUID()}.${ext}`;

    const photo = await this.prisma.$transaction(async (tx: any) => {
      const existing = await tx.photo.findMany({ where: { profileId: profile.id } });

      if (this.useSupabase) {
        for (const p of existing) {
          await this.supabaseDelete(p.s3Key).catch((err: any) =>
            logger.warn(`Failed to delete old Supabase photo ${p.s3Key}: ${err?.message}`),
          );
        }
        await this.supabaseUpload(filename, file.buffer, file.mimetype);
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

    if (this.useSupabase) {
      await this.supabaseDelete(photo.s3Key).catch((err: any) =>
        logger.warn(`Failed to delete Supabase photo ${photo.s3Key}: ${err?.message}`),
      );
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

  private async supabaseUpload(filename: string, buffer: Buffer, mimetype: string): Promise<void> {
    const resp = await fetch(this.storageUrl(filename), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.supabaseKey}`,
        'Content-Type': mimetype,
        'x-upsert': 'true',
      },
      body: buffer,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => 'unknown');
      logger.error(`Supabase upload failed (${resp.status}): ${text}`);
      throw new BadRequestException('Photo upload to storage failed');
    }
  }

  private async supabaseDelete(filename: string): Promise<void> {
    const resp = await fetch(this.storageUrl(filename), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });
    if (!resp.ok && resp.status !== 404) {
      const text = await resp.text().catch(() => 'unknown');
      logger.warn(`Supabase delete failed (${resp.status}): ${text}`);
    }
  }
}
