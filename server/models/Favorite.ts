import { Schema, model } from 'mongoose';
import { IFavorite } from '../types';

const favoriteSchema = new Schema<IFavorite>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User reference is required'],
		},
		movie: {
			type: Schema.Types.ObjectId,
			ref: 'Movie',
			required: [true, 'Movie reference is required'],
		},
	},
	{
		timestamps: true,
	}
);

// Compound index to ensure a user can only favorite a movie once
favoriteSchema.index({ user: 1, movie: 1 }, { unique: true });

export const Favorite = model<IFavorite>('Favorite', favoriteSchema);
