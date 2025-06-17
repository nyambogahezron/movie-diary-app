import nodemailer from 'nodemailer';
import { User } from '../types';
import NodemailerConfig from '../config/NodeMailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailService {
	private static transporter = nodemailer.createTransport(NodemailerConfig());
	private static readonly fromEmail = process.env.SMTP_USER!;
	private static readonly clientUrl = process.env.CLIENT_URL!;

	static async sendVerificationEmail(user: User, token: string): Promise<void> {
		const verificationLink = `${this.clientUrl}/verify-email?token=${token}`;

		const mailOptions = {
			from: this.fromEmail,
			to: user.email,
			subject: 'Verify Your Email Address - Movie Diary',
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Movie Diary!</h2>
                    <p>Hi ${user.name},</p>
                    <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                    <p style="text-align: center;">
                        <a href="${verificationLink}" 
                           style="background-color: #3498db; color: white; padding: 10px 20px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                           Verify Email Address
                        </a>
                    </p>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p>${verificationLink}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you did not create an account, please ignore this email.</p>
                    <p>Thank you,<br>The Movie Diary Team</p>
                </div>
            `,
		};

		await this.transporter.sendMail(mailOptions);
	}

	static async sendWelcomeEmail(user: User): Promise<void> {
		const mailOptions = {
			from: this.fromEmail,
			to: user.email,
			subject: 'Welcome to Movie Diary!',
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Movie Diary!</h2>
                    <p>Hi ${user.name},</p>
                    <p>Thank you for joining Movie Diary. We're excited to have you on board!</p>
                    <p>With Movie Diary, you can:</p>
                    <ul>
                        <li>Track movies you've watched</li>
                        <li>Create and manage watchlists</li>
                        <li>Rate and review your favorite films</li>
                        <li>Discover new movies</li>
                    </ul>
                    <p>Get started by exploring the app and adding your first movie!</p>
                    <p>Thank you,<br>The Movie Diary Team</p>
                </div>
            `,
		};

		await this.transporter.sendMail(mailOptions);
	}

	static async sendNewLoginAlert(
		user: User,
		ipAddress: string,
		deviceInfo: string
	): Promise<void> {
		const mailOptions = {
			from: this.fromEmail,
			to: user.email,
			subject: 'New Login Detected - Movie Diary',
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Login Alert</h2>
                    <p>Hi ${user.name},</p>
                    <p>We detected a new login to your Movie Diary account from a new device or location.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>IP Address:</strong> ${ipAddress}</p>
                        <p><strong>Device Info:</strong> ${deviceInfo}</p>
                        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <p>If this was you, you can ignore this email.</p>
                    <p>If you don't recognize this activity, please change your password immediately and contact support.</p>
                    <p>Thank you,<br>The Movie Diary Team</p>
                </div>
            `,
		};

		await this.transporter.sendMail(mailOptions);
	}

	static async sendPasswordResetEmail(
		user: User,
		token: string
	): Promise<void> {
		const resetLink = `${this.clientUrl}/reset-password?token=${token}`;

		const mailOptions = {
			from: this.fromEmail,
			to: user.email,
			subject: 'Reset Your Password - Movie Diary',
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Reset Your Password</h2>
                    <p>Hi ${user.name},</p>
                    <p>You recently requested to reset your password for your Movie Diary account. Click the button below to reset it:</p>
                    <p style="text-align: center;">
                        <a href="${resetLink}" 
                           style="background-color: #3498db; color: white; padding: 10px 20px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                           Reset Your Password
                        </a>
                    </p>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p>${resetLink}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <p>Thank you,<br>The Movie Diary Team</p>
                </div>
            `,
		};

		await this.transporter.sendMail(mailOptions);
	}

	static async sendPasswordChangeNotification(user: User): Promise<void> {
		const mailOptions = {
			from: this.fromEmail,
			to: user.email,
			subject: 'Password Changed - Movie Diary',
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Changed</h2>
                    <p>Hi ${user.name},</p>
                    <p>The password for your Movie Diary account has been changed successfully.</p>
                    <p>If you did not make this change, please contact our support team immediately.</p>
                    <p>Thank you,<br>The Movie Diary Team</p>
                </div>
            `,
		};

		await this.transporter.sendMail(mailOptions);
	}

	static async sendEmailChangeNotification(
		user: User,
		oldEmail: string,
		newEmail: string
	): Promise<void> {
		const mailOptions = {
			from: this.fromEmail,
			to: oldEmail,
			subject: 'Email Address Changed - Movie Diary',
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Address Changed</h2>
                    <p>Hi ${user.name},</p>
                    <p>The email address associated with your Movie Diary account has been changed from:</p>
                    <p><strong>${oldEmail}</strong> to <strong>${newEmail}</strong></p>
                    <p>If you did not make this change, please contact our support team immediately.</p>
                    <p>Thank you,<br>The Movie Diary Team</p>
                </div>
            `,
		};

		await this.transporter.sendMail(mailOptions);
	}
}
