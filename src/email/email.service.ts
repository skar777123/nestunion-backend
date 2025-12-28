
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(private configService: ConfigService) {
        // Initialize with environment variables or default to a mock for development if variables are missing
        const host = this.configService.get<string>('SMTP_HOST');
        const user = this.configService.get<string>('SMTP_USER');
        const pass = this.configService.get<string>('SMTP_PASS');

        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host: host,
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: { user, pass },
            });
        } else {
            this.logger.warn('SMTP credentials not found, using ethereal.email mock for development');
            // Fallback for dev - prints URL to console
            nodemailer.createTestAccount().then((account) => {
                this.transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: { user: account.user, pass: account.pass }
                });
            });
        }
    }

    async sendOtp(email: string, otp: string) {
        if (!this.transporter) {
            this.logger.error('Email transporter not ready');
            return;
        }

        const mailOptions = {
            from: '"NestUnion Auth" <no-reply@nestunion.com>',
            to: email,
            subject: 'Your Login OTP',
            text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
            html: `<p>Your OTP is: <strong>${otp}</strong></p><p>It expires in 5 minutes.</p>`,
        };

        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Message sent: ${info.messageId}`);

        // Preview only available when sending through an Ethereal account
        if (nodemailer.getTestMessageUrl(info)) {
            this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
    }
}
