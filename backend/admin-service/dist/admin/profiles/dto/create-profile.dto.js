"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDto = exports.CreateProfileDto = void 0;
class CreateProfileDto {
    userId;
    name;
    dob;
    gender;
    seeking;
    bio;
    heightCm;
    ethnicity;
    religion;
    relationshipIntent;
    education;
    occupation;
    languages;
    interests;
    locationLat;
    locationLng;
    locationName;
}
exports.CreateProfileDto = CreateProfileDto;
class UpdateProfileDto {
    name;
    dob;
    gender;
    seeking;
    bio;
    heightCm;
    ethnicity;
    religion;
    relationshipIntent;
    education;
    occupation;
    languages;
    interests;
    locationLat;
    locationLng;
    locationName;
    isVerified;
    isActive;
    isPremium;
    lastActiveAt;
    onboardingStep;
    onboardingComplete;
}
exports.UpdateProfileDto = UpdateProfileDto;
//# sourceMappingURL=create-profile.dto.js.map