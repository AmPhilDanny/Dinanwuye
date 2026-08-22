import type { JwtRequest } from '@dinanwuye/shared';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, LogoutDto, OtpSendResponseDto, RefreshDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';
import { OtpService } from '../otp/otp.service';
export declare class AuthController {
    private readonly auth;
    private readonly otp;
    constructor(auth: AuthService, otp: OtpService);
    signup(dto: SignupDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    sendOtp(dto: {
        identifier: string;
        purpose: 'signup' | 'login' | 'password_reset';
    }): Promise<OtpSendResponseDto>;
    verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseDto>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(request: JwtRequest, dto: LogoutDto): Promise<{
        success: true;
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map