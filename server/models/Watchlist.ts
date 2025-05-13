import { Schema, model } from 'mongoose';
import { IWatchlist } from '../types';

const watchlistSchema = new Schema<IWatchlist>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User reference is required'],
		},
		movies: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Movie',
			},
		],
		name: {
			type: String,
			required: [true, 'Watchlist name is required'],
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Indexes
watchlistSchema.index({ user: 1, name: 1 }, { unique: true });
watchlistSchema.index({ isPublic: 1 });

export const Watchlist = model<IWatchlist>('Watchlist', watchlistSchema);
