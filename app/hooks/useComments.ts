import { User } from '@/types/User';
import { useEffect, useState } from 'react';

export type Comment = {
	id: string;
	user: User;
	text: string;
	timeAgo: string;
};

// Mock comments data for UI development
const MOCK_COMMENTS: Record<number, Comment[]> = {
	1: [
		{
			id: '1',
			user: {
				id: 'user4',
				name: 'John Doe',
				username: 'johndoe',
				avatar:
					'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			},
			text: 'Great review! I completely agree with your points about the cinematography.',
			timeAgo: '2h ago',
		},
		{
			id: '2',
			user: {
				id: 'user5',
				name: 'Jane Smith',
				username: 'janesmith',
				avatar:
					'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			},
			text: 'I had a different experience with this movie, but I appreciate your perspective!',
			timeAgo: '1h ago',
		},
	],
	2: [
		{
			id: '3',
			user: {
				id: 'user6',
				name: 'Mike Johnson',
				username: 'mikejohnson',
				avatar:
					'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			},
			text: 'The soundtrack was amazing, right?',
			timeAgo: '30m ago',
		},
	],
};

export function useComments(postId: number) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Simulate API fetch
		const fetchComments = async () => {
			try {
				// In a real app, you would fetch from your backend API
				// const response = await fetch(`/api/posts/${postId}/comments`);
				// const data = await response.json();

				// Simulate loading delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				setComments(MOCK_COMMENTS[postId] || []);
				setIsLoading(false);
			} catch (err) {
				setError('Failed to fetch comments. Please try again later.');
				setIsLoading(false);
			}
		};

		fetchComments();
	}, [postId]);

	const addComment = async (text: string) => {
		try {
			// In a real app, you would send this to your backend API
			// const response = await fetch(`/api/posts/${postId}/comments`, {
			//   method: 'POST',
			//   body: JSON.stringify({ text }),
			// });
			// const newComment = await response.json();

			// Mock new comment
			const newComment: Comment = {
				id: Date.now().toString(),
				user: {
					id: 'currentUser',
					name: 'Current User',
					username: 'currentuser',
					avatar:
						'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
				},
				text,
				timeAgo: 'Just now',
			};

			setComments((prev) => [newComment, ...prev]);
			return newComment;
		} catch (err) {
			setError('Failed to add comment. Please try again later.');
			throw err;
		}
	};

	return { comments, isLoading, error, addComment };
}
