import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
const BUCKET = 'profile-photos';

@Injectable()
export class PhotosService {
  private readonly supabaseUrl: string;
  private readonly serviceKey: string;
  private readonly publicBase: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.supabaseUrl = this.config.get<string>('SUPABASE_URL') || 'https://ysvqvrskwyyjbeepbyuc.supabase.co';
    this.serviceKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';
    this.publicBase = `${this.supabaseUrl}/storage/v1/object/public/${BUCKET}`;
  }

  private async uploadToSupabase(path: string, buffer: Buffer, mimetype: string): Promise<void> {
    const url = `${this.supabaseUrl}/storage/v1/object/${BUCKET}/${path}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.serviceKey}`,
        'Content-Type': mimetype,
        'x-upsert': 'true',
      },
      body: buffer,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new BadRequestException(`Supabase upload failed: ${err}`);
    }
  }

  private async deleteFromSupabase(path: string): Promise<void> {
    try {
      const url = `${this.supabaseUrl}/storage/v1/object/${BUCKET}/${path}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.serviceKey}` },
      });
      if (!res.ok && res.status !== 404) {
        console.warn(`Supabase delete failed for ${path}: ${await res.text()}`);
      }
    } catch (err: any) {
      console.warn(`Network error deleting from Supabase: ${err.message}`);
    }
  }

  private buildPublicUrl(path: string): string {
    // Supabase public storage URLs use the raw path (slashes intact).
    // Do NOT encodeURIComponent the whole path — it would encode '/' to '%2F'.
    return `${this.publicBase}/${path}`;
  }

  async addPhoto(userId: string, file: UploadFile, order: number = 0): Promise<PhotoDto> {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!ALLOWED_MIME.includes(file.mimetype)) throw new BadRequestException('Photo must be jpeg, png, or webp');
    if (file.size > MAX_BYTES) throw new BadRequestException('Photo must be under 10 MB');

    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found — GET /profiles/me first');

    const ext = file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    const storagePath = `${userId}/${filename}`;

    await this.uploadToSupabase(storagePath, file.buffer, file.mimetype);

    const photo = await this.prisma.$transaction(async (tx: any) => {
      const existing = await tx.photo.findMany({ where: { profileId: profile.id } });
      for (const p of existing) {
        await this.deleteFromSupabase(p.s3Key);
      }
      await tx.photo.deleteMany({ where: { profileId: profile.id } });
      return tx.photo.create({
        data: { profileId: profile.id, s3Key: storagePath, order },
      });
    });

    return { id: photo.id, s3Key: photo.s3Key, order: photo.order, moderationStatus: photo.moderationStatus };
  }

  async removePhoto(userId: string, photoId: string): Promise<{ success: true }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const photo = await this.prisma.photo.findFirst({ where: { id: photoId, profileId: profile.id } });
    if (!photo) throw new NotFoundException('Photo not found');

    await this.deleteFromSupabase(photo.s3Key);
    await this.prisma.photo.delete({ where: { id: photoId } });
    return { success: true };
  }

  async listPhotos(userId: string): Promise<PhotoDto[]> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return [];
    const photos = await this.prisma.photo.findMany({ where: { profileId: profile.id }, orderBy: { order: 'asc' } });
    return photos.map((p: any) => ({ id: p.id, s3Key: p.s3Key, order: p.order, moderationStatus: p.moderationStatus }));
  }

  getPublicUrl(storagePath: string): string {
    if (!storagePath) return '';
    if (storagePath.startsWith('http') || storagePath.startsWith('data:')) return storagePath;
    return this.buildPublicUrl(storagePath);
  }

  async getPhotoBuffer(storagePath: string): Promise<{ buffer: Buffer; contentType: string } | null> {
    if (!storagePath) return null;
    try {
      const url = `${this.supabaseUrl}/storage/v1/object/${BUCKET}/${storagePath}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.serviceKey}` },
      });
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = storagePath.split('.').pop()?.toLowerCase() || 'jpg';
      const contentTypeMap: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
      };
      const contentType = contentTypeMap[ext] || 'image/jpeg';
      return { buffer, contentType };
    } catch (err: any) {
      console.warn(`Failed to fetch photo buffer for ${storagePath}: ${err.message}`);
      return null;
    }
  }
}
