import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Tv, Clock, Eye } from 'lucide-react';
import { MediaEntry } from '../../types';
import RatingStars from '../ui/RatingStars';

interface MediaCardProps {
	media: MediaEntry;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
	const detailsPath =
		media.type === 'movie' ? `/movie/${media.id}` : `/tv/${media.id}`;

	return (
		<div className='card group h-full flex flex-col'>
			<div className='relative overflow-hidden'>
				<Link to={detailsPath}>
					<img
						src={media.poster}
						alt={media.title}
						className='w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70'></div>
					<div className='absolute top-2 left-2 bg-gray-900 bg-opacity-70 p-1 rounded'>
						{media.type === 'movie' ? (
							<Film className='h-4 w-4 text-blue-400' />
						) : (
							<Tv className='h-4 w-4 text-green-400' />
						)}
					</div>
					{media.progress !== undefined && media.progress < 100 && (
						<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-700'>
							<div
								className='h-full bg-blue-500'
								style={{ width: `${media.progress}%` }}
							></div>
						</div>
					)}
				</Link>
			</div>

			<div className='p-4 flex-grow flex flex-col'>
				<Link to={detailsPath}>
					<h3 className='font-medium text-lg line-clamp-2 group-hover:text-blue-400 transition-colors duration-200'>
						{media.title}
					</h3>
				</Link>

				<div className='flex items-center text-sm text-gray-400 mt-1 space-x-3'>
					<div className='flex items-center'>
						{media.type === 'movie' ? (
							<Film className='h-3 w-3 mr-1' />
						) : (
							<Tv className='h-3 w-3 mr-1' />
						)}
						<span>{media.type === 'movie' ? 'Movie' : 'TV'}</span>
					</div>

					{media.dateWatched && (
						<div className='flex items-center'>
							<Clock className='h-3 w-3 mr-1' />
							<span>{new Date(media.dateWatched).toLocaleDateString()}</span>
						</div>
					)}
				</div>

				<div className='mt-2'>
					<RatingStars rating={media.rating} readonly size='small' />
				</div>

				{media.status && (
					<div className='mt-2'>
						<span
							className={`px-2 py-1 text-xs rounded-full ${
								media.status === 'Currently Watching'
									? 'bg-blue-900 text-blue-200'
									: media.status === 'Completed'
									? 'bg-green-900 text-green-200'
									: media.status === 'Planning to Watch'
									? 'bg-purple-900 text-purple-200'
									: media.status === 'Paused'
									? 'bg-yellow-900 text-yellow-200'
									: 'bg-red-900 text-red-200'
							}`}
						>
							{media.status}
						</span>
					</div>
				)}

				<div className='mt-auto pt-3 flex justify-between items-center text-sm'>
					{media.rewatches > 0 && (
						<div className='flex items-center text-gray-400'>
							<Eye className='h-3 w-3 mr-1' />
							<span>
								{media.rewatches === 1
									? 'Watched once'
									: `Watched ${media.rewatches} times`}
							</span>
						</div>
					)}

					{media.favorite && (
						<span className='text-red-400 flex items-center'>
							<svg className='h-3 w-3 mr-1 fill-current' viewBox='0 0 24 24'>
								<path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
							</svg>
							Favorite
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default MediaCard;
