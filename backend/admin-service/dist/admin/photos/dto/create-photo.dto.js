"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePhotoDto = exports.CreatePhotoDto = void 0;
class CreatePhotoDto {
    profileId = '';
    s3Key = '';
    order;
    moderationStatus;
}
exports.CreatePhotoDto = CreatePhotoDto;
class UpdatePhotoDto {
    order;
    moderationStatus;
}
exports.UpdatePhotoDto = UpdatePhotoDto;
//# sourceMappingURL=create-photo.dto.js.map