import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Photo } from '../../common/types';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const photos = await this.prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        profile: {
          select: { id: true, userId: true, name: true }
        }
      }
    });
    return photos;
  }

  async findOne(id: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
      include: {
        profile: {
          select: { id: true, userId: true, name: true }
        }
      }
    });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return photo;
  }

  async create(createPhotoDto: {
    profileId: string;
    s3Key: string;
    order?: number;
    moderationStatus?: string;
  }) {
    const photo = await this.prisma.photo.create({
      data: {
        ...createPhotoDto,
        moderationStatus: createPhotoDto.moderationStatus || 'pending',
      },
    });
    return photo;
  }

  async update(id: string, updatePhotoDto: {
    order?: number;
    moderationStatus?: string;
  }) {
    const photo = await this.prisma.photo.update({
      where: { id },
      data: updatePhotoDto,
    });
    return photo;
  }

  async remove(id: string) {
    await this.prisma.photo.delete({
      where: { id },
    });
    return { message: `Photo ${id} deleted successfully` };
  }
}