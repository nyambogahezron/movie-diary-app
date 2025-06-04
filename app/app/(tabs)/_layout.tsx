import Colors from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { BarChart3, LibraryBig, Tv, User, Users } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
	return (
		<View style={styles.container}>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors.primary[500],
					tabBarInactiveTintColor: Colors.neutral[400],
					tabBarStyle: styles.tabBar,
					tabBarLabelStyle: styles.tabBarLabel,
					headerStyle: {
						backgroundColor: Colors.neutral[950],
						borderBottomWidth: 1,
						borderBottomColor: Colors.neutral[800],
						height: Platform.OS === 'ios' ? 100 : 80,
					},
					headerTitleContainerStyle: {
						paddingHorizontal: 16,
						paddingBottom: 16,
					},
					headerTitleStyle: {
						fontFamily: 'Inter-Bold',
						fontSize: 28,
						color: Colors.neutral[50],
					},
				}}
			>
				<Tabs.Screen
					name='index'
					options={{
						title: 'Discover',
						tabBarIcon: ({ size, color }) => <Tv size={size} color={color} />,
					}}
				/>
				<Tabs.Screen
					name='dashboard'
					options={{
						title: 'Dashboard',
						tabBarIcon: ({ size, color }) => (
							<BarChart3 size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='library'
					options={{
						title: 'Library',
						tabBarIcon: ({ size, color }) => (
							<LibraryBig size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='social'
					options={{
						title: 'Social',
						tabBarIcon: ({ size, color }) => (
							<Users size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: 'Profile',
						headerShown: false,
						tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
					}}
				/>
			</Tabs>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.neutral[950],
	},
	tabBar: {
		backgroundColor: Colors.neutral[900],
		borderTopWidth: 0,
		paddingTop: 10,
		paddingBottom: 50,
		height: 105,
		elevation: 0,
	},
	tabBarLabel: {
		fontFamily: 'Inter-Medium',
		fontSize: 12,
		marginBottom: 6,
	},
});
