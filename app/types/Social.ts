import { Media } from './Media';
import { User } from './User';

export type SocialPost = {
	id: number;
	user: User;
	media: Media;
	rating: number;
	review: string;
	timeAgo: string;
	likes: number;
	comments: number;
};
