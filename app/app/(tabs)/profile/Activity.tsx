import EmptyState from '@/components/EmptyState';
import UserAvatar from '@/components/UserAvatar';
import Colors from '@/constants/Colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Heart, MessageCircle, Share2, Star } from 'lucide-react-native';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const Tab = createMaterialTopTabNavigator();

type Activity = {
	id: string;
	type: 'review';
	media: {
		title: string;
		type: 'movie' | 'tv';
		poster: string;
	};
	rating: number;
	review: string;
	timeAgo: string;
	likes: number;
	comments: number;
};

export default function ActivityTab() {
	const activities: Activity[] = [
		{
			id: '1',
			type: 'review',
			media: {
				title: 'Inception',
				type: 'movie',
				poster: 'https://example.com/poster.jpg',
			},
			rating: 4.5,
			review: 'Mind-bending masterpiece!',
			timeAgo: '2 hours ago',
			likes: 12,
			comments: 3,
		},
		// Add more mock activities here
	];

	const renderActivityItem = ({ item }: { item: Activity }) => (
		<View style={styles.activityItem}>
			<View style={styles.activityHeader}>
				<UserAvatar
					user={{ id: 'current', name: 'You', username: 'you' }}
					size={40}
				/>
				<View style={styles.activityHeaderText}>
					<Text style={styles.activityTitle}>
						You reviewed {item.media.title}
					</Text>
					<Text style={styles.activityTime}>{item.timeAgo}</Text>
				</View>
			</View>

			<View style={styles.activityContent}>
				<View style={styles.ratingContainer}>
					<Star size={16} color={Colors.accent[500]} />
					<Text style={styles.ratingText}>{item.rating}/5</Text>
				</View>
				<Text style={styles.reviewText}>{item.review}</Text>
			</View>

			<View style={styles.activityActions}>
				<TouchableOpacity style={styles.actionButton}>
					<Heart size={20} color={Colors.neutral[400]} />
					<Text style={styles.actionText}>{item.likes}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton}>
					<MessageCircle size={20} color={Colors.neutral[400]} />
					<Text style={styles.actionText}>{item.comments}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton}>
					<Share2 size={20} color={Colors.neutral[400]} />
				</TouchableOpacity>
			</View>
		</View>
	);

	return activities.length > 0 ? (
		<FlatList
			scrollEnabled={false}
			data={activities}
			renderItem={renderActivityItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.tabContentContainer}
			showsVerticalScrollIndicator={false}
		/>
	) : (
		<EmptyState
			message='No activity yet'
			subMessage='Your activity will appear here when you start reviewing movies and shows'
		/>
	);
}

const styles = StyleSheet.create({
	tabContentContainer: {
		padding: 16,
	},
	activityItem: {
		backgroundColor: Colors.neutral[900],
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	activityHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	activityHeaderText: {
		marginLeft: 12,
	},
	activityTitle: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[100],
	},
	activityTime: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[500],
	},
	activityContent: {
		marginTop: 8,
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	ratingText: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.accent[500],
		marginLeft: 8,
	},
	reviewText: {
		fontFamily: 'Inter-Regular',
		fontSize: 15,
		color: Colors.neutral[200],
		lineHeight: 22,
	},
	activityActions: {
		flexDirection: 'row',
		marginTop: 16,
		paddingTop: 12,
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
		fontSize: 14,
		color: Colors.neutral[400],
		marginLeft: 6,
	},
});
