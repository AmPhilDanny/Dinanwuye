import type { JwtRequest } from '../shared';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, LogoutDto, OtpSendResponseDto, RefreshDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';
import { LivenessResultDto } from './dto/liveness.dto';
import { OtpService } from '../otp/otp.service';
import { LivenessService } from './liveness.service';
export declare class AuthController {
    private readonly auth;
    private readonly otp;
    private readonly liveness;
    constructor(auth: AuthService, otp: OtpService, liveness: LivenessService);
    signup(dto: SignupDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    sendOtp(dto: {
        identifier: string;
        purpose: 'signup' | 'login' | 'password_reset';
    }): Promise<OtpSendResponseDto>;
    verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseDto>;
    getLivenessChallenge(): {
        challenges: string[];
    };
    verifyLiveness(request: JwtRequest, dto: LivenessResultDto): Promise<{
        attemptId: string;
        passed: boolean;
        challenges: ("blink" | "open_mouth" | "smile" | "turn_head")[];
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(request: JwtRequest, dto: LogoutDto): Promise<{
        success: true;
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map