import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { OtpModule } from '../otp/otp.module';
import { LivenessService } from './liveness.service';

@Module({
  imports: [JwtModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LivenessService],
  exports: [AuthService],
})
export class AuthModule {}
