"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_BUCKETS = exports.REDIS_KEYS = exports.SUBSCRIPTION_PLANS = exports.SUBSCRIPTION_PROVIDERS = exports.MATCH_STATUSES = exports.USER_STATUSES = exports.REPORT_STATUSES = exports.REPORT_CATEGORIES = exports.SWIPE_ACTIONS = exports.SUPERLIKE_DAILY_LIMIT_PREMIUM = exports.SUPERLIKE_DAILY_LIMIT_FREE = exports.LIKE_DAILY_LIMIT_FREE = exports.OTP_RESEND_COOLDOWN_SECONDS = exports.OTP_MAX_ATTEMPTS = exports.OTP_TTL_SECONDS = exports.JWT_REFRESH_EXPIRES_IN = exports.JWT_EXPIRES_IN = exports.PORTS = exports.API_PREFIX = exports.SERVICE_NAME = void 0;
/**
 * @dinanwuye/shared — cross-service constants
 * Single source of truth for values shared across all backend services.
 */
exports.SERVICE_NAME = 'Dinanwuye';
exports.API_PREFIX = 'api/v1';
exports.PORTS = {
    API_GATEWAY: 3000,
    AUTH: 3001,
    PROFILE: 3002,
    MESSAGING: 3003,
    WS: 3004,
    TRUST_SAFETY: 3005,
    NOTIFICATION: 3006,
    PAYMENT: 3007,
    MATCHING: 8000,
};
exports.JWT_EXPIRES_IN = '15m';
exports.JWT_REFRESH_EXPIRES_IN = '7d';
exports.OTP_TTL_SECONDS = 300; // 5 minutes
exports.OTP_MAX_ATTEMPTS = 5;
exports.OTP_RESEND_COOLDOWN_SECONDS = 60;
exports.LIKE_DAILY_LIMIT_FREE = 50;
exports.SUPERLIKE_DAILY_LIMIT_FREE = 3;
exports.SUPERLIKE_DAILY_LIMIT_PREMIUM = 10;
exports.SWIPE_ACTIONS = ['like', 'pass', 'superlike'];
exports.REPORT_CATEGORIES = [
    'harassment',
    'fake_profile',
    'inappropriate_content',
    'underage',
    'scam',
    'other',
];
exports.REPORT_STATUSES = ['pending', 'reviewing', 'resolved', 'dismissed'];
exports.USER_STATUSES = ['active', 'suspended', 'banned', 'deleted'];
exports.MATCH_STATUSES = ['active', 'unmatched'];
exports.SUBSCRIPTION_PROVIDERS = ['stripe', 'paystack'];
exports.SUBSCRIPTION_PLANS = ['premium_monthly', 'premium_annual', 'premium_lifetime'];
exports.REDIS_KEYS = {
    otp: (identifier) => `otp:${identifier}`,
    otpAttempts: (identifier) => `otp:attempts:${identifier}`,
    otpCooldown: (identifier) => `otp:cooldown:${identifier}`,
    refreshToken: (userId, jti) => `refresh:${userId}:${jti}`,
    deckCache: (userId) => `deck:${userId}`,
    swipeDaily: (userId) => `swipes:daily:${userId}`,
    presence: (userId) => `presence:${userId}`,
    blockedBy: (userId) => `blocked:by:${userId}`,
    blocking: (userId) => `blocked:user:${userId}`,
};
exports.S3_BUCKETS = {
    MEDIA: 'dinanwuye-media',
    DOCUMENTS: 'dinanwuye-documents',
};
//# sourceMappingURL=constants.js.map