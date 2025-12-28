
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../schemas/otp.schema';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
        private emailService: EmailService
    ) { }

    async sendOtp(email: string) {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB with 5 min expiry
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Upsert OTP for this email
        await this.otpModel.findOneAndUpdate(
            { email },
            { otp, expiresAt, isVerified: false },
            { upsert: true, new: true }
        );

        // Send Email
        await this.emailService.sendOtp(email, otp);

        return { message: 'OTP sent successfully' };
    }

    async verifyOtp(email: string, otp: string) {
        const otpRecord = await this.otpModel.findOne({ email });

        if (!otpRecord) {
            throw new NotFoundException('OTP not found for this email');
        }

        if (otpRecord.expiresAt < new Date()) {
            throw new BadRequestException('OTP has expired');
        }

        if (otpRecord.otp !== otp) {
            throw new UnauthorizedException('Invalid OTP');
        }

        // Mark as verified
        otpRecord.isVerified = true;
        await otpRecord.save();

        // Check if user exists
        const user = await this.usersService.findByEmail(email);

        if (user) {
            // User exists -> Login
            const payload = { email: user.email, sub: (user as any)._id, roles: user.roles || ['user'] };
            return {
                message: 'Login successful',
                access_token: this.jwtService.sign(payload),
                isNewUser: false,
                user
            };
        } else {
            // User does not exist -> Return specific response so frontend knows to redirect to Register
            return {
                message: 'OTP Verified. User not found, please register.',
                isNewUser: true,
                email: email
            };
        }
    }
}
