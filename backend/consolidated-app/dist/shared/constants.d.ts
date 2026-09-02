/**
 * @dinanwuye/shared — cross-service constants
 * Single source of truth for values shared across all backend services.
 */
export declare const SERVICE_NAME = "Dinanwuye";
export declare const API_PREFIX = "api/v1";
export declare const JWT_EXPIRES_IN = "15m";
export declare const JWT_REFRESH_EXPIRES_IN = "7d";
export declare const OTP_TTL_SECONDS = 300;
export declare const OTP_MAX_ATTEMPTS = 5;
export declare const OTP_RESEND_COOLDOWN_SECONDS = 60;
export declare const LIKE_DAILY_LIMIT_FREE = 50;
export declare const SUPERLIKE_DAILY_LIMIT_FREE = 3;
export declare const SUPERLIKE_DAILY_LIMIT_PREMIUM = 10;
export declare const SWIPE_ACTIONS: readonly ["like", "pass", "superlike"];
export type SwipeAction = (typeof SWIPE_ACTIONS)[number];
export declare const REPORT_CATEGORIES: readonly ["harassment", "fake_profile", "inappropriate_content", "underage", "scam", "other"];
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];
export declare const REPORT_STATUSES: readonly ["pending", "reviewing", "resolved", "dismissed"];
export type ReportStatus = (typeof REPORT_STATUSES)[number];
export declare const USER_STATUSES: readonly ["active", "suspended", "banned", "deleted"];
export type UserStatus = (typeof USER_STATUSES)[number];
export declare const MATCH_STATUSES: readonly ["active", "unmatched"];
export type MatchStatus = (typeof MATCH_STATUSES)[number];
export declare const SUBSCRIPTION_PROVIDERS: readonly ["stripe", "paystack"];
export type SubscriptionProvider = (typeof SUBSCRIPTION_PROVIDERS)[number];
export declare const SUBSCRIPTION_PLANS: readonly ["premium_monthly", "premium_annual", "premium_lifetime"];
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];
export declare const REDIS_KEYS: {
    readonly otp: (identifier: string) => string;
    readonly otpAttempts: (identifier: string) => string;
    readonly otpCooldown: (identifier: string) => string;
    readonly refreshToken: (userId: string, jti: string) => string;
    readonly deckCache: (userId: string) => string;
    readonly swipeDaily: (userId: string) => string;
    readonly presence: (userId: string) => string;
    readonly blockedBy: (userId: string) => string;
    readonly blocking: (userId: string) => string;
};
export declare const S3_BUCKETS: {
    readonly MEDIA: "dinanwuye-media";
    readonly DOCUMENTS: "dinanwuye-documents";
};
//# sourceMappingURL=constants.d.ts.map