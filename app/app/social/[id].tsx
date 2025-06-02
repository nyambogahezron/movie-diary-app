import CommentsBottomSheet from '@/components/CommentsBottomSheet';
import MediaMiniCard from '@/components/MediaMiniCard';
import RatingStars from '@/components/RatingStars';
import UserAvatar from '@/components/UserAvatar';
import Colors from '@/constants/Colors';
import { useSocialFeed } from '@/hooks/useSocialFeed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import {
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function PostDetailsScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const [isFavorite, setIsFavorite] = useState(false);
	const [isCommentsVisible, setIsCommentsVisible] = useState(false);

	// Get post data
	const { posts } = useSocialFeed();
	const post = posts.find((item) => item.id.toString() === id);

	if (!post) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Post not found</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<ChevronLeft size={24} color={Colors.neutral[100]} />
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Post Header */}
				<View style={styles.postHeader}>
					<UserAvatar user={post.user} size={48} />
					<View style={styles.postHeaderText}>
						<Text style={styles.userName}>{post.user.name}</Text>
						<Text style={styles.postTime}>{post.timeAgo}</Text>
					</View>
				</View>

				{/* Media Card */}
				<MediaMiniCard media={post.media} />

				{/* Post Content */}
				<View style={styles.postContent}>
					<View style={styles.ratingContainer}>
						<RatingStars rating={post.rating} size={20} />
						<Text style={styles.ratingText}>{post.rating}/5</Text>
					</View>

					<Text style={styles.reviewText}>{post.review}</Text>
				</View>

				{/* Post Actions */}
				<View style={styles.postActions}>
					<TouchableOpacity
						style={styles.actionButton}
						onPress={() => setIsFavorite(!isFavorite)}
					>
						<Heart
							size={24}
							color={isFavorite ? Colors.primary[500] : Colors.neutral[400]}
							fill={isFavorite ? Colors.primary[500] : 'transparent'}
						/>
						<Text
							style={[styles.actionText, isFavorite && styles.actionTextActive]}
						>
							{post.likes}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.actionButton}
						onPress={() => setIsCommentsVisible(true)}
					>
						<MessageCircle size={24} color={Colors.neutral[400]} />
						<Text style={styles.actionText}>{post.comments}</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionButton}>
						<Share2 size={24} color={Colors.neutral[400]} />
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Comments Bottom Sheet */}
			<CommentsBottomSheet
				isVisible={isCommentsVisible}
				onClose={() => setIsCommentsVisible(false)}
				postId={post.id}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.neutral[950],
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		paddingTop: Platform.OS === 'ios' ? 50 : 30,
		paddingHorizontal: 16,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: Platform.OS === 'ios' ? 100 : 80,
		padding: 16,
	},
	postHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	postHeaderText: {
		marginLeft: 12,
	},
	userName: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 18,
		color: Colors.neutral[100],
	},
	postTime: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[500],
	},
	postContent: {
		marginTop: 16,
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	ratingText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.accent[500],
		marginLeft: 8,
	},
	reviewText: {
		fontFamily: 'Inter-Regular',
		fontSize: 16,
		color: Colors.neutral[200],
		lineHeight: 24,
	},
	postActions: {
		flexDirection: 'row',
		marginTop: 24,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: Colors.neutral[800],
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 24,
	},
	actionText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[400],
		marginLeft: 8,
	},
	actionTextActive: {
		color: Colors.primary[500],
	},
	errorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.neutral[950],
	},
	errorText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[400],
	},
});
