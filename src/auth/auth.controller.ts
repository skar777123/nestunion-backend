
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

export class SendOtpDto {
    email: string;
}

export class VerifyOtpDto {
    email: string;
    otp: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('send-otp')
    @HttpCode(HttpStatus.OK)
    async sendOtp(@Body() body: SendOtpDto) {
        return this.authService.sendOtp(body.email);
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyOtp(@Body() body: VerifyOtpDto) {
        return this.authService.verifyOtp(body.email, body.otp);
    }
}
