import EmptyState from '@/components/EmptyState';
import MediaMiniCard from '@/components/MediaMiniCard';
import RatingStars from '@/components/RatingStars';
import UserAvatar from '@/components/UserAvatar';
import Colors from '@/constants/Colors';
import { useSocialFeed } from '@/hooks/useSocialFeed';
import { SocialPost } from '@/types/Social';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const Tab = createMaterialTopTabNavigator();

const SocialFeedContent = ({
	filter,
}: {
	filter: 'following' | 'popular' | 'discover';
}) => {
	const { posts, isLoading, error } = useSocialFeed();
	const router = useRouter();

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Something went wrong</Text>
				<Text style={styles.errorSubtext}>{error}</Text>
			</View>
		);
	}

	const renderPostItem = ({ item }: { item: SocialPost }) => (
		<TouchableOpacity
			style={styles.postContainer}
			onPress={() => router.push(`/social/${item.id}`)}
		>
			<View style={styles.postHeader}>
				<UserAvatar user={item.user} size={40} />
				<View style={styles.postHeaderText}>
					<Text style={styles.userName}>{item.user.name}</Text>
					<Text style={styles.postTime}>{item.timeAgo}</Text>
				</View>
			</View>

			<MediaMiniCard media={item.media} />

			<View style={styles.postContent}>
				<View style={styles.ratingContainer}>
					<RatingStars rating={item.rating} size={16} />
					<Text style={styles.ratingText}>{item.rating}/5</Text>
				</View>

				<Text style={styles.reviewText}>{item.review}</Text>
			</View>

			<View style={styles.postActions}>
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
		</TouchableOpacity>
	);

	return (
		<View style={styles.contentContainer}>
			{posts.length > 0 ? (
				<FlatList
					data={posts}
					renderItem={renderPostItem}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<EmptyState
					message='No posts to show'
					subMessage='Follow users to see their activity here'
				/>
			)}
		</View>
	);
};

const FollowingTab = () => <SocialFeedContent filter='following' />;
const PopularTab = () => <SocialFeedContent filter='popular' />;
const DiscoverTab = () => <SocialFeedContent filter='discover' />;

export default function SocialScreen() {
	return (
		<View style={styles.container}>
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: styles.tabBar,
					tabBarLabelStyle: styles.tabLabel,
					tabBarIndicatorStyle: styles.tabIndicator,
					tabBarActiveTintColor: Colors.neutral[50],
					tabBarInactiveTintColor: Colors.neutral[400],
					tabBarItemStyle: { padding: 0 },
					tabBarContentContainerStyle: { padding: 0 },
					sceneStyle: {
						backgroundColor: Colors.neutral[950],
					},
				}}
			>
				<Tab.Screen name='Following' component={FollowingTab} />
				<Tab.Screen name='Popular' component={PopularTab} />
				<Tab.Screen name='Discover' component={DiscoverTab} />
			</Tab.Navigator>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.neutral[950],
	},
	tabBar: {
		backgroundColor: Colors.neutral[950],
		borderBottomWidth: 1,
		borderBottomColor: Colors.neutral[800],
		elevation: 0,
		shadowOpacity: 0,
	},
	tabLabel: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		textTransform: 'none',
	},
	tabIndicator: {
		backgroundColor: Colors.primary[500],
		height: 3,
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
	},
	contentContainer: {
		flex: 1,
	},
	listContent: {
		padding: 16,
		paddingTop: 8,
	},
	postContainer: {
		backgroundColor: Colors.neutral[900],
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
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
		fontFamily: 'Inter-Medium',
		fontSize: 16,
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
	postActions: {
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
	errorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	errorText: {
		fontFamily: 'Inter-Bold',
		fontSize: 18,
		color: Colors.neutral[100],
		marginBottom: 8,
	},
	errorSubtext: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[400],
		textAlign: 'center',
	},
});
