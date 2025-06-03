import EmptyState from '@/components/EmptyState';
import StatisticCard from '@/components/StatisticCard';
import UserAvatar from '@/components/UserAvatar';
import WatchTimeChart from '@/components/WatchTimeChart';
import Colors from '@/constants/Colors';
import { useProfile } from '@/hooks/useProfile';
import { User } from '@/types/User';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
	Bookmark,
	ChevronRight,
	Clock,
	Eye,
	Film,
	Heart,
	List,
	MessageCircle,
	Settings,
	Share2,
	Star,
	Tv,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
	Animated,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from 'react-native';

const Tab = createMaterialTopTabNavigator();

type Stats = {
	totalWatchTime: string;
	averageRating: number;
	moviesWatched: number;
	showsWatched: number;
	watchTimeByMonth: Array<{ month: string; hours: number }>;
	topGenres: Array<{ name: string; count: number; color: string }>;
};

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

type List = {
	id: string;
	name: string;
	count: number;
	icon: React.ReactNode;
};

// Statistics Tab Component
const StatisticsTab = ({ stats }: { stats: Stats | null }) => (
	<ScrollView
		style={styles.tabContent}
		contentContainerStyle={styles.tabContentContainer}
		showsVerticalScrollIndicator={false}
	>
		<Text style={styles.sectionTitle}>Your Watching Time</Text>
		<WatchTimeChart data={stats?.watchTimeByMonth} />

		<View style={styles.statsRow}>
			<StatisticCard
				title='Total Watch Time'
				value={stats?.totalWatchTime || '0h'}
				icon={<Clock size={20} color={Colors.primary[500]} />}
			/>
			<StatisticCard
				title='Average Rating'
				value={stats?.averageRating?.toString() || '0'}
				icon={<Star size={20} color={Colors.accent[500]} />}
			/>
		</View>

		<View style={styles.statsRow}>
			<StatisticCard
				title='Movies Watched'
				value={stats?.moviesWatched?.toString() || '0'}
				icon={<Film size={20} color={Colors.success[500]} />}
			/>
			<StatisticCard
				title='TV Shows Watched'
				value={stats?.showsWatched?.toString() || '0'}
				icon={<Tv size={20} color={Colors.warning[500]} />}
			/>
		</View>

		<Text style={styles.sectionTitle}>Most Watched Genres</Text>
		<View style={styles.genresContainer}>
			{stats?.topGenres?.map((genre, index) => (
				<View key={index} style={styles.genreItem}>
					<View style={[styles.genreBadge, { backgroundColor: genre.color }]}>
						<Text style={styles.genreCount}>{genre.count}</Text>
					</View>
					<Text style={styles.genreName}>{genre.name}</Text>
				</View>
			))}
		</View>
	</ScrollView>
);

// Activity Tab Component
const ActivityTab = () => {
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
};

// Lists Tab Component
const ListsTab = () => {
	const lists: List[] = [
		{
			id: '1',
			name: 'Watchlist',
			count: 12,
			icon: <Bookmark size={20} color={Colors.primary[500]} />,
		},
		{
			id: '2',
			name: 'Watched',
			count: 45,
			icon: <Eye size={20} color={Colors.success[500]} />,
		},
		{
			id: '3',
			name: 'Custom Lists',
			count: 3,
			icon: <List size={20} color={Colors.accent[500]} />,
		},
	];

	const renderListItem = ({ item }: { item: List }) => (
		<TouchableOpacity style={styles.listItem}>
			<View style={styles.listItemContent}>
				<View style={styles.listIconContainer}>{item.icon}</View>
				<View style={styles.listItemText}>
					<Text style={styles.listName}>{item.name}</Text>
					<Text style={styles.listCount}>{item.count} items</Text>
				</View>
			</View>
			<ChevronRight size={20} color={Colors.neutral[400]} />
		</TouchableOpacity>
	);

	return (
		<FlatList
			data={lists}
			renderItem={renderListItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.tabContentContainer}
			showsVerticalScrollIndicator={false}
		/>
	);
};

export default function ProfileScreen() {
	const { user, stats, isLoading } = useProfile() as {
		user: User | null;
		stats: Stats | null;
		isLoading: boolean;
	};
	const scrollY = useRef(new Animated.Value(0)).current;
	const { height: windowHeight } = useWindowDimensions();
	const [activeTab, setActiveTab] = useState(0);

	// Animation values
	const headerHeight = scrollY.interpolate({
		inputRange: [0, 100],
		outputRange: [1, 0.7],
		extrapolate: 'clamp',
	});

	const headerOpacity = scrollY.interpolate({
		inputRange: [0, 100],
		outputRange: [1, 0.9],
		extrapolate: 'clamp',
	});

	const headerTranslateY = scrollY.interpolate({
		inputRange: [0, 100],
		outputRange: [0, -20],
		extrapolate: 'clamp',
	});

	const renderHeader = () => (
		<>
			<View style={styles.header}>
				<Text style={styles.title}>Profile</Text>
				<TouchableOpacity style={styles.settingsButton}>
					<Settings size={24} color={Colors.neutral[300]} />
				</TouchableOpacity>
			</View>

			<Animated.View
				style={[
					styles.profileHeader,
					{
						transform: [
							{ scale: headerHeight },
							{ translateY: headerTranslateY },
						],
						opacity: headerOpacity,
					},
				]}
			>
				<UserAvatar user={user as unknown as User} size={80} />
				<View style={styles.profileInfo}>
					<Text style={styles.profileName}>{user?.name}</Text>
					<Text style={styles.profileUsername}>@{user?.username}</Text>
					<View style={styles.profileStats}>
						<View style={styles.profileStat}>
							<Text style={styles.profileStatNumber}>{user?.watched || 0}</Text>
							<Text style={styles.profileStatLabel}>Watched</Text>
						</View>
						<View style={styles.profileStat}>
							<Text style={styles.profileStatNumber}>
								{user?.followers || 0}
							</Text>
							<Text style={styles.profileStatLabel}>Followers</Text>
						</View>
						<View style={styles.profileStat}>
							<Text style={styles.profileStatNumber}>
								{user?.following || 0}
							</Text>
							<Text style={styles.profileStatLabel}>Following</Text>
						</View>
					</View>
				</View>
			</Animated.View>
		</>
	);

	const renderTabContent = () => {
		const currentStats = stats as unknown as Stats;
		switch (activeTab) {
			case 0:
				return <StatisticsTab stats={currentStats} />;
			case 1:
				return <ActivityTab />;
			case 2:
				return <ListsTab />;
			default:
				return null;
		}
	};

	return (
		<View style={styles.container}>
			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				showsVerticalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				scrollEventThrottle={16}
				stickyHeaderIndices={[2]} // Make the tab bar sticky
			>
				{renderHeader()}
				<View style={[styles.tabContainer, { minHeight: windowHeight - 200 }]}>
					<Tab.Navigator
						screenOptions={{
							tabBarLabelStyle: styles.tabLabel,
							tabBarIndicatorStyle: styles.tabIndicator,
							tabBarActiveTintColor: Colors.neutral[50],
							tabBarInactiveTintColor: Colors.neutral[400],
							tabBarPressColor: Colors.neutral[800],
							tabBarItemStyle: { padding: 0 },
							tabBarContentContainerStyle: { padding: 0 },
							sceneStyle: {
								backgroundColor: Colors.neutral[950],
							},
							tabBarStyle: {
								backgroundColor: Colors.neutral[950],
								borderBottomWidth: 1,
								borderBottomColor: Colors.neutral[800],
								elevation: 0,
								shadowOpacity: 0,
							},
						}}
						screenListeners={{
							state: (e) => {
								setActiveTab(e.data.state.index);
							},
						}}
					>
						<Tab.Screen
							name='Statistics'
							options={{ tabBarLabel: 'Statistics' }}
						>
							{() => <StatisticsTab stats={stats as unknown as Stats} />}
						</Tab.Screen>
						<Tab.Screen name='Activity' options={{ tabBarLabel: 'Activity' }}>
							{() => <ActivityTab />}
						</Tab.Screen>
						<Tab.Screen name='Lists' options={{ tabBarLabel: 'Lists' }}>
							{() => <ListsTab />}
						</Tab.Screen>
					</Tab.Navigator>
				</View>
			</Animated.ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.neutral[950],
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
		paddingHorizontal: 16,
		paddingTop: 48,
	},
	title: {
		fontFamily: 'Inter-Bold',
		fontSize: 28,
		color: Colors.neutral[50],
	},
	settingsButton: {
		padding: 8,
	},
	profileHeader: {
		flexDirection: 'row',
		marginBottom: 24,
		paddingHorizontal: 16,
	},
	profileInfo: {
		marginLeft: 16,
		flex: 1,
	},
	profileName: {
		fontFamily: 'Inter-Bold',
		fontSize: 22,
		color: Colors.neutral[50],
		marginBottom: 4,
	},
	profileUsername: {
		fontFamily: 'Inter-Regular',
		fontSize: 16,
		color: Colors.neutral[400],
		marginBottom: 12,
	},
	profileStats: {
		flexDirection: 'row',
	},
	profileStat: {
		marginRight: 24,
	},
	profileStatNumber: {
		fontFamily: 'Inter-Bold',
		fontSize: 18,
		color: Colors.neutral[100],
		marginBottom: 2,
	},
	profileStatLabel: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[500],
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
	tabContent: {
		flex: 1,
	},
	tabContentContainer: {
		padding: 16,
	},
	sectionTitle: {
		fontFamily: 'Inter-Medium',
		fontSize: 18,
		color: Colors.neutral[200],
		marginBottom: 16,
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	genresContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 16,
	},
	genreItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 16,
		marginBottom: 12,
	},
	genreBadge: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
	},
	genreCount: {
		fontFamily: 'Inter-Bold',
		fontSize: 12,
		color: Colors.neutral[950],
	},
	genreName: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.neutral[300],
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
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: Colors.neutral[900],
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	listItemContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	listIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.neutral[800],
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	listItemText: {
		flex: 1,
	},
	listName: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[100],
		marginBottom: 4,
	},
	listCount: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[500],
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
	},
	tabContainer: {
		flex: 1,
	},
});
