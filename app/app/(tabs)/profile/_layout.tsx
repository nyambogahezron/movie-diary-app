import { useTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function ProfileLayout() {
	const { colors } = useTheme();

	return (
		<View style={[styles.container, { backgroundColor: colors.neutral[950] }]}>
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: colors.neutral[950],
					},
					headerShadowVisible: true,
					headerTitleStyle: {
						fontFamily: 'Inter-Bold',
						fontSize: 28,
						color: colors.neutral[50],
					},
					contentStyle: {
						backgroundColor: colors.neutral[950],
					},
				}}
			>
				<Stack.Screen
					name='index'
					options={{
						title: 'Profile',
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name='settings'
					options={{
						title: 'Settings',
						headerRight: () => (
							<Settings
								size={24}
								color={colors.neutral[400]}
								style={{ marginRight: 16 }}
							/>
						),
					}}
				/>
			</Stack>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
