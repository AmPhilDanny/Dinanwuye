export class CreatePhotoDto {
  profileId: string = '';
  s3Key: string = '';
  order?: number;
  moderationStatus?: string;
}

export class UpdatePhotoDto {
  order?: number;
  moderationStatus?: string;
}