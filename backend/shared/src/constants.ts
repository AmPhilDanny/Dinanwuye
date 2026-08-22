/**
 * @dinanwuye/shared — cross-service constants
 * Single source of truth for values shared across all backend services.
 */
export const SERVICE_NAME = 'Dinanwuye';

export const API_PREFIX = 'api/v1';

export const PORTS = {
  API_GATEWAY: 3000,
  AUTH: 3001,
  PROFILE: 3002,
  MESSAGING: 3003,
  WS: 3004,
  TRUST_SAFETY: 3005,
  NOTIFICATION: 3006,
  PAYMENT: 3007,
  MATCHING: 8000,
} as const;

export const JWT_EXPIRES_IN = '15m';
export const JWT_REFRESH_EXPIRES_IN = '7d';
export const OTP_TTL_SECONDS = 300; // 5 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const LIKE_DAILY_LIMIT_FREE = 50;
export const SUPERLIKE_DAILY_LIMIT_FREE = 3;
export const SUPERLIKE_DAILY_LIMIT_PREMIUM = 10;

export const SWIPE_ACTIONS = ['like', 'pass', 'superlike'] as const;
export type SwipeAction = (typeof SWIPE_ACTIONS)[number];

export const REPORT_CATEGORIES = [
  'harassment',
  'fake_profile',
  'inappropriate_content',
  'underage',
  'scam',
  'other',
] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

export const REPORT_STATUSES = ['pending', 'reviewing', 'resolved', 'dismissed'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const USER_STATUSES = ['active', 'suspended', 'banned', 'deleted'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const MATCH_STATUSES = ['active', 'unmatched'] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const SUBSCRIPTION_PROVIDERS = ['stripe', 'paystack'] as const;
export type SubscriptionProvider = (typeof SUBSCRIPTION_PROVIDERS)[number];

export const SUBSCRIPTION_PLANS = ['premium_monthly', 'premium_annual', 'premium_lifetime'] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export const REDIS_KEYS = {
  otp: (identifier: string) => `otp:${identifier}`,
  otpAttempts: (identifier: string) => `otp:attempts:${identifier}`,
  otpCooldown: (identifier: string) => `otp:cooldown:${identifier}`,
  refreshToken: (userId: string, jti: string) => `refresh:${userId}:${jti}`,
  deckCache: (userId: string) => `deck:${userId}`,
  swipeDaily: (userId: string) => `swipes:daily:${userId}`,
  presence: (userId: string) => `presence:${userId}`,
  blockedBy: (userId: string) => `blocked:by:${userId}`,
  blocking: (userId: string) => `blocked:user:${userId}`,
} as const;

export const S3_BUCKETS = {
  MEDIA: 'dinanwuye-media',
  DOCUMENTS: 'dinanwuye-documents',
} as const;