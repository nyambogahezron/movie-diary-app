import { SocialPost } from '@/types/Social';
import { useEffect, useState } from 'react';

// Mock data for UI development
const SOCIAL_POSTS: SocialPost[] = [
	{
		id: 1,
		user: {
			id: 'user1',
			name: 'Emma Watson',
			username: 'emmawatson',
			avatar:
				'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		},
		media: {
			id: 501,
			title: 'Barbie',
			posterUrl:
				'https://images.pexels.com/photos/4226894/pexels-photo-4226894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			type: 'movie',
			year: 2023,
		},
		rating: 4.5,
		review:
			'This movie was a delightful surprise! The satire is sharp, and the performances are fantastic. Definitely worth watching for both Barbie fans and skeptics.',
		timeAgo: '2 hours ago',
		likes: 128,
		comments: 24,
	},
	{
		id: 2,
		user: {
			id: 'user2',
			name: 'Tom Hardy',
			username: 'tomhardy',
			avatar:
				'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		},
		media: {
			id: 502,
			title: 'The Last of Us',
			posterUrl:
				'https://images.pexels.com/photos/6447217/pexels-photo-6447217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			type: 'tv',
			year: 2023,
		},
		rating: 5,
		review:
			'One of the best video game adaptations ever made. The performances are incredible, especially Pedro Pascal and Bella Ramsey. The third episode alone deserves all the awards.',
		timeAgo: '1 day ago',
		likes: 349,
		comments: 67,
	},
	{
		id: 3,
		user: {
			id: 'user3',
			name: 'Zendaya',
			username: 'zendaya',
			avatar:
				'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		},
		media: {
			id: 503,
			title: 'Poor Things',
			posterUrl:
				'https://images.pexels.com/photos/8471831/pexels-photo-8471831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			type: 'movie',
			year: 2023,
		},
		rating: 4,
		review:
			'Emma Stone delivers a career-best performance in this bizarre but captivating Yorgos Lanthimos film. The production design and costumes are absolutely stunning.',
		timeAgo: '3 days ago',
		likes: 215,
		comments: 42,
	},
];

export function useSocialFeed() {
	const [posts, setPosts] = useState<SocialPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Simulate API fetch
		const fetchData = async () => {
			try {
				// In a real app, you would fetch from your backend/social API

				// Simulate loading delay
				await new Promise((resolve) => setTimeout(resolve, 1200));

				setPosts(SOCIAL_POSTS);
				setIsLoading(false);
			} catch (err) {
				setError('Failed to fetch social feed. Please try again later.');
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return { posts, isLoading, error };
}
