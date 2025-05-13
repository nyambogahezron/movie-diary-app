import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters long'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: (value: string) => validator.isEmail(value),
				message: 'Invalid email address',
			},
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [6, 'Password must be at least 6 characters long'],
			trim: true,
		},
		avatar: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Hash password before saving
userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema);
