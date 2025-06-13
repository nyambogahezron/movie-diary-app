import { useTheme } from '@/context/ThemeContext';
import { Tabs } from 'expo-router';
import { BarChart3, LibraryBig, Tv, User, Users } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
	const { colors } = useTheme();

	return (
		<View style={[styles.container, { backgroundColor: colors.neutral[950] }]}>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: colors.primary[500],
					tabBarInactiveTintColor: colors.neutral[400],
					tabBarStyle: [
						styles.tabBar,
						{ backgroundColor: colors.neutral[900] },
					],
					tabBarLabelStyle: styles.tabBarLabel,
				}}
			>
				<Tabs.Screen
					name='index'
					options={{
						title: 'Discover',
						tabBarIcon: ({ size, color }) => <Tv size={22} color={color} />,
					}}
				/>
				<Tabs.Screen
					name='dashboard'
					options={{
						title: 'Dashboard',
						tabBarIcon: ({ size, color }) => (
							<BarChart3 size={22} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='library'
					options={{
						title: 'Library',
						tabBarIcon: ({ size, color }) => (
							<LibraryBig size={22} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='social'
					options={{
						title: 'Social',
						tabBarIcon: ({ size, color }) => <Users size={22} color={color} />,
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: 'Profile',
						headerShown: false,
						tabBarIcon: ({ size, color }) => <User size={22} color={color} />,
					}}
				/>
			</Tabs>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tabBar: {
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
