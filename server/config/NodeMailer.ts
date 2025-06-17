import dotenv from 'dotenv';

dotenv.config();

export default function NodemailerConfig() {
	return {
		service: process.env.EMAIL_SERVICE!,
		auth: {
			user: process.env.SMTP_USER!,
			pass: process.env.SMTP_PASSWORD!,
		},
	};
}
