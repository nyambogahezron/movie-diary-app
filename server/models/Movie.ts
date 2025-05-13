import { Schema, model } from 'mongoose';
import { IMovie } from '../types';

const movieSchema = new Schema<IMovie>(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
		},
		tmdbId: {
			type: String,
			required: [true, 'TMDB ID is required'],
			unique: true,
		},
		posterPath: {
			type: String,
		},
		releaseDate: {
			type: Date,
		},
		overview: {
			type: String,
		},
		rating: {
			type: Number,
			min: [0, 'Rating must be at least 0'],
			max: [10, 'Rating must be at most 10'],
		},
		watchDate: {
			type: Date,
		},
		review: {
			type: String,
		},
		genres: [
			{
				type: String,
			},
		],
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User reference is required'],
		},
	},
	{
		timestamps: true,
	}
);

// Indexes for faster queries
movieSchema.index({ user: 1, tmdbId: 1 }, { unique: true });
movieSchema.index({ title: 'text', overview: 'text' });

export const Movie = model<IMovie>('Movie', movieSchema);
