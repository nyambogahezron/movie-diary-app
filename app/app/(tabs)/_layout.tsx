import Colors from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { LibraryBig, Tv, User, Users } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.primary[500],
				tabBarInactiveTintColor: Colors.neutral[400],
				tabBarStyle: styles.tabBar,
				tabBarLabelStyle: styles.tabBarLabel,
				headerShown: false,
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
					tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		backgroundColor: Colors.neutral[900],
		borderTopWidth: 0,
		paddingTop: 10,
		paddingBottom: 50,
		height: 105,
	},
	tabBarLabel: {
		fontFamily: 'Inter-Medium',
		fontSize: 12,
		marginBottom: 6,
	},
});
