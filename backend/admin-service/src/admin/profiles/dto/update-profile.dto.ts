export class UpdateProfileDto {
  name?: string;
  dob?: string;
  gender?: string;
  seeking?: string[];
  bio?: string;
  heightCm?: number;
  ethnicity?: string;
  religion?: string;
  relationshipIntent?: string;
  education?: string;
  occupation?: string;
  languages?: string[];
  interests?: string[];
  locationLat?: number;
  locationLng?: number;
  locationName?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isPremium?: boolean;
  lastActiveAt?: string;
  onboardingStep?: number;
  onboardingComplete?: boolean;
}