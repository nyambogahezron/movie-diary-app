import UserAvatar from '@/components/UserAvatar';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/hooks/useProfile';
import { User } from '@/types/User';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View } from 'react-native';
import ActivityTab from './Activity';
import ListsTab from './Lists';
import StatisticsTab from './Statistics';

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen() {
	const { colors } = useTheme();
	const { user, isLoading } = useProfile() as {
		user: User | null;
		isLoading: boolean;
	};

	if (isLoading || !user) {
		return null; // Or a loading spinner
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.neutral[950] }]}>
			{/* Profile Header */}
			<View style={styles.profileHeader}>
				<UserAvatar user={user} size={80} />
				<View style={styles.profileInfo}>
					<Text style={[styles.profileName, { color: colors.neutral[50] }]}>
						{user.name}
					</Text>
					<Text
						style={[styles.profileUsername, { color: colors.neutral[400] }]}
					>
						@{user.username}
					</Text>
					<View style={styles.profileStats}>
						<View style={styles.profileStat}>
							<Text
								style={[
									styles.profileStatNumber,
									{ color: colors.neutral[100] },
								]}
							>
								{user.watched || 0}
							</Text>
							<Text
								style={[
									styles.profileStatLabel,
									{ color: colors.neutral[500] },
								]}
							>
								Watched
							</Text>
						</View>
						<View style={styles.profileStat}>
							<Text
								style={[
									styles.profileStatNumber,
									{ color: colors.neutral[100] },
								]}
							>
								{user.followers || 0}
							</Text>
							<Text
								style={[
									styles.profileStatLabel,
									{ color: colors.neutral[500] },
								]}
							>
								Followers
							</Text>
						</View>
						<View style={styles.profileStat}>
							<Text
								style={[
									styles.profileStatNumber,
									{ color: colors.neutral[100] },
								]}
							>
								{user.following || 0}
							</Text>
							<Text
								style={[
									styles.profileStatLabel,
									{ color: colors.neutral[500] },
								]}
							>
								Following
							</Text>
						</View>
					</View>
				</View>
			</View>

			{/* Profile Tabs */}
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: {
						backgroundColor: colors.neutral[950],
						elevation: 0,
						shadowOpacity: 0,
					},
					tabBarLabelStyle: {
						fontFamily: 'Inter-Medium',
						fontSize: 14,
						textTransform: 'none',
					},
					tabBarActiveTintColor: colors.neutral[50],
					tabBarInactiveTintColor: colors.neutral[400],
					tabBarIndicatorStyle: {
						backgroundColor: colors.primary[500],
						height: 3,
						borderTopLeftRadius: 3,
						borderTopRightRadius: 3,
					},
				}}
			>
				<Tab.Screen
					name='statistics'
					options={{ title: 'Statistics' }}
					component={StatisticsTab}
				/>
				<Tab.Screen
					name='activity'
					options={{ title: 'Activity' }}
					component={ActivityTab}
				/>
				<Tab.Screen
					name='lists'
					options={{ title: 'Lists' }}
					component={ListsTab}
				/>
			</Tab.Navigator>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
		marginBottom: 4,
	},
	profileUsername: {
		fontFamily: 'Inter-Regular',
		fontSize: 16,
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
		marginBottom: 2,
	},
	profileStatLabel: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
	},
});
