export type User = {
  id: string;
  email: string | null;
  phone: string | null;
  emailHash: string | null;
  phoneHash: string | null;
  passwordHash: string | null;
  status: string;
  role: string;
  isVerified: boolean;
  deviceFingerprint: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Profile = {
  id: string;
  userId: string;
  name: string;
  dob: Date;
  gender: string;
  seeking: string[];
  bio: string | null;
  heightCm: number | null;
  ethnicity: string | null;
  religion: string | null;
  relationshipIntent: string | null;
  education: string | null;
  occupation: string | null;
  languages: string[];
  interests: string[];
  locationLat: number | null;
  locationLng: number | null;
  locationName: string | null;
  isVerified: boolean;
  isActive: boolean;
  isPremium: boolean;
  lastActiveAt: Date;
  onboardingStep: number;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Photo = {
  id: string;
  profileId: string;
  s3Key: string;
  order: number;
  moderationStatus: string;
  createdAt: Date;
};

export type Match = {
  id: string;
  userAId: string;
  userBId: string;
  status: string;
  createdAt: Date;
};

export type Swipe = {
  id: string;
  actorId: string;
  targetId: string;
  action: string;
  createdAt: Date;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AuditLog = {
  id: string;
  adminId: string;
  action: string;
  entity: string;
  entityId: string | null;
  oldData: any | null;
  newData: any | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
};