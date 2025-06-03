import UserAvatar from '@/components/UserAvatar';
import Colors from '@/constants/Colors';
import { useProfile } from '@/hooks/useProfile';
import { User } from '@/types/User';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import ActivityTab from './Activity';
import ListsTab from './Lists';
import StatisticsTab from './Statistics';

const Tab = createMaterialTopTabNavigator();

type Stats = {
	totalWatchTime: string;
	averageRating: number;
	moviesWatched: number;
	showsWatched: number;
	watchTimeByMonth: Array<{ month: string; hours: number }>;
	topGenres: Array<{ name: string; count: number; color: string }>;
};

export default function ProfileLayout() {
	const { user, stats, isLoading } = useProfile() as {
		user: User | null;
		stats: Stats | null;
		isLoading: boolean;
	};
	const { height: windowHeight } = useWindowDimensions();
	const [activeTab, setActiveTab] = useState(0);

	const renderHeader = () => (
		<View style={styles.profileHeader}>
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
						<Text style={styles.profileStatNumber}>{user?.followers || 0}</Text>
						<Text style={styles.profileStatLabel}>Followers</Text>
					</View>
					<View style={styles.profileStat}>
						<Text style={styles.profileStatNumber}>{user?.following || 0}</Text>
						<Text style={styles.profileStatLabel}>Following</Text>
					</View>
				</View>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			{renderHeader()}
			<View style={[styles.tabContainer, { minHeight: windowHeight - 200 }]}>
				<Tab.Navigator
					screenOptions={{
						tabBarStyle: styles.tabBar,
						tabBarLabelStyle: styles.tabLabel,
						tabBarIndicatorStyle: styles.tabIndicator,
						tabBarActiveTintColor: Colors.neutral[50],
						tabBarInactiveTintColor: Colors.neutral[400],
						tabBarPressColor: Colors.neutral[800],
						sceneStyle: {
							backgroundColor: Colors.neutral[950],
						},
					}}
					screenListeners={{
						state: (e) => {
							setActiveTab(e.data.state.index);
						},
					}}
				>
					<Tab.Screen
						name='index'
						options={{ tabBarLabel: 'Statistics' }}
						component={StatisticsTab}
					/>
					<Tab.Screen
						name='activity'
						options={{ tabBarLabel: 'Activity' }}
						component={ActivityTab}
					/>
					<Tab.Screen
						name='lists'
						options={{ tabBarLabel: 'Lists' }}
						component={ListsTab}
					/>
				</Tab.Navigator>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.neutral[950],
	},
	profileHeader: {
		flexDirection: 'row',
		marginBottom: 24,
		paddingHorizontal: 16,
		marginTop: 50,
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
	tabContainer: {
		flex: 1,
	},
});
