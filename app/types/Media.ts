export type Media = {
	id: number;
	title: string;
	posterUrl: string;
	backdropUrl?: string;
	type: 'movie' | 'tv';
	year: number;
	genres?: string[];
	rating?: number;
	description?: string;
	releaseDate?: string;
	duration?: number;
	progress?: {
		current: number;
		total: number;
	};
	dateWatched?: string;
	status?: 'Currently Watching' | 'Completed' | 'Planning to Watch' | 'Paused';
	rewatches?: number;
	favorite?: boolean;
};
