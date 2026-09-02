import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.module';
import { OtpService } from '../otp/otp.service';
import { AuthResponseDto, LoginDto, RefreshDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    private readonly otp;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, otp: OtpService);
    signup(dto: SignupDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseDto>;
    refresh(dto: RefreshDto): Promise<TokenPair>;
    logout(userId: string, dto: {
        refreshToken: string;
    }): Promise<{
        success: true;
    }>;
    private issueTokens;
    private hashIdentifier;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map