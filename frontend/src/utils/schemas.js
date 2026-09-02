/**
 * Zod schemas for runtime API validation — aligned to backend DTOs
 * (auth: identifier+OTP, profile: profiles/me, matching: snake_case, messaging: conversations)
 */

import { z } from 'zod';

// ========================================
// Auth Schemas (auth-service DTOs)
// ========================================
export const SignupRequestSchema = z
  .object({
    email: z.string().email('Invalid email').optional(),
    phone: z.string().regex(/^\+[1-9]\d{6,14}$/, 'Phone must be E.164 (e.g. +2348012345678)').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
  });

export const LoginRequestSchema = z.object({
  identifier: z.string().min(3, 'Enter your email or phone'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const OtpSendRequestSchema = z.object({
  identifier: z.string().min(3, 'Enter your email or phone'),
  purpose: z.enum(['signup', 'login', 'password_reset']),
});

export const VerifyOtpRequestSchema = z.object({
  identifier: z.string().min(3),
  code: z.string().regex(/^\d{6}$/, 'Code must be exactly 6 digits'),
  purpose: z.enum(['signup', 'login', 'password_reset']),
});

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(10),
});

export const AuthResponseSchema = z.object({
  userId: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  accessToken: z.string().min(10),
  refreshToken: z.string().min(10),
  isNewUser: z.boolean(),
});

export const OtpSendResponseSchema = z.object({
  message: z.string(),
  retryAfterSeconds: z.number().int().optional(),
});

// ========================================
// Profile Schemas (profile-service DTOs)
// ========================================
export const GENDERS = ['male', 'female', 'non_binary'];
export const SEEKING_OPTIONS = ['men', 'women', 'everyone'];

export const PhotoSchema = z.object({
  id: z.string(),
  s3Key: z.string(),
  order: z.number().int(),
  moderationStatus: z.string(),
});

export const ProfileResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  age: z.number().int(),
  gender: z.enum(GENDERS),
  seeking: z.array(z.enum(SEEKING_OPTIONS)),
  bio: z.string().nullable().optional(),
  heightCm: z.number().int().nullable().optional(),
  ethnicity: z.string().nullable().optional(),
  religion: z.string().nullable().optional(),
  relationshipIntent: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  languages: z.array(z.string()),
  interests: z.array(z.string()),
  locationGeo: z.object({ lat: z.number(), lng: z.number() }).nullable().optional(),
  locationName: z.string().nullable().optional(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  isPremium: z.boolean(),
  lastActiveAt: z.string(),
  onboardingStep: z.number().int(),
  onboardingComplete: z.boolean(),
  photos: z.array(PhotoSchema),
});

export const UpdateProfileSchema = z
  .object({
    name: z.string().min(2).max(60).optional(),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD').optional(),
    gender: z.enum(GENDERS).optional(),
    seeking: z.array(z.enum(SEEKING_OPTIONS)).min(1).max(3).optional(),
    bio: z.string().max(500).optional(),
    heightCm: z.number().int().min(120).max(230).optional(),
    ethnicity: z.string().max(40).optional(),
    religion: z.string().max(40).optional(),
    relationshipIntent: z.string().max(40).optional(),
    education: z.string().max(60).optional(),
    occupation: z.string().max(60).optional(),
    languages: z.array(z.string()).max(10).optional(),
    interests: z.array(z.string()).max(20).optional(),
    locationLat: z.number().min(-90).max(90).optional(),
    locationLng: z.number().min(-180).max(180).optional(),
    locationName: z.string().max(120).optional(),
    onboardingStep: z.number().int().min(0).optional(),
    onboardingComplete: z.boolean().optional(),
  })
  .partial();

export const PreferencesSchema = z.object({
  ageMin: z.number().int().min(18).max(99),
  ageMax: z.number().int().min(18).max(99),
  distanceKm: z.number().int().min(1).max(500),
  showOnlineStatus: z.boolean(),
  showDistance: z.boolean(),
  incognitoMode: z.boolean(),
});

// ========================================
// Matching Schemas (matching-service — snake_case)
// ========================================
export const DeckItemSchema = z.object({
  user_id: z.string(),
  name: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
  age: z.number().int(),
  gender: z.string(),
  location: z.string().nullable().optional(),
  distance_km: z.number().nullable().optional(),
  compatibility_score: z.number().int().min(0).max(100),
  interests: z.array(z.string()),
  is_verified: z.boolean(),
  is_premium: z.boolean(),
  last_active_at: z.string().nullable().optional(),
});

export const DeckResponseSchema = z.object({
  items: z.array(DeckItemSchema),
  has_more: z.boolean(),
  next_cursor: z.string().nullable().optional(),
});

export const SwipeRequestSchema = z.object({
  target_id: z.string().min(8).max(64),
  action: z.enum(['like', 'pass', 'superlike']),
});

export const SwipeResponseSchema = z.object({
  matched: z.boolean(),
  match: z
    .object({
      id: z.string(),
      user_a_id: z.string(),
      user_b_id: z.string(),
      status: z.string(),
      created_at: z.string(),
    })
    .nullable()
    .optional(),
  remaining_likes: z.number().int().nullable().optional(),
});

export const MatchSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.string(),
  status: z.string(),
});

// ========================================
// Messaging Schemas (messaging-service — conversations)
// ========================================
export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  contentType: z.string(),
  mediaRef: z.string().nullable().optional(),
  readAt: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const ConversationSummarySchema = z.object({
  id: z.string(),
  otherUserId: z.string(),
  lastMessage: MessageSchema.nullable().optional(),
  unreadCount: z.number().int(),
  updatedAt: z.string(),
});

export const ConversationDetailSchema = z.object({
  id: z.string(),
  userAId: z.string(),
  userBId: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

export const MessagesPageSchema = z.object({
  items: z.array(MessageSchema),
  nextCursor: z.string().nullable().optional(),
  hasMore: z.boolean(),
});

export const SendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

// ========================================
// Safety Schemas (trust-safety-service)
// ========================================
export const ReportSchema = z.object({
  targetId: z.string().min(8).max(64),
  category: z.enum(['harassment', 'fake_profile', 'inappropriate_content', 'spam', 'scam', 'underage', 'other']),
  context: z.string().max(500).optional(),
});

export const BlockSchema = z.object({
  targetId: z.string().min(8).max(64),
});

export const ExclusionsSchema = z.object({
  blockedBy: z.array(z.string()),
  blocking: z.array(z.string()),
});

// ========================================
// Error Schema
// ========================================
export const ApiErrorSchema = z.object({
  statusCode: z.number().int(),
  error: z.string(),
  message: z.string().or(z.array(z.string())),
});

// ========================================
// Validation helpers
// ========================================
export const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
      .join('; ');
    throw new Error(message || 'Validation failed');
  }
  return result.data;
};

export const validateAsync = async (schema, data) => {
  const result = await schema.safeParseAsync(data);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
      .join('; ');
    throw new Error(message || 'Validation failed');
  }
  return result.data;
};
