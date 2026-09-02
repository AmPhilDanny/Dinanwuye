export declare const OTP_PURPOSES: readonly ["signup", "login", "password_reset"];
export type OtpPurpose = (typeof OTP_PURPOSES)[number];
export declare class SignupDto {
    email?: string;
    phone?: string;
    password: string;
}
export declare class LoginDto {
    identifier: string;
    password: string;
}
export declare class VerifyOtpDto {
    identifier: string;
    code: string;
    purpose: OtpPurpose;
}
export declare class RefreshDto {
    refreshToken: string;
}
export declare class LogoutDto {
    refreshToken: string;
}
export declare class AuthResponseDto {
    userId: string;
    email?: string;
    phone?: string;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
    requiresLiveness: boolean;
}
export declare class OtpSendResponseDto {
    message: string;
    retryAfterSeconds?: number;
}
//# sourceMappingURL=auth.dto.d.ts.map