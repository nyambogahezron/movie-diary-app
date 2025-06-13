import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const SettingsScreen: React.FC = () => {
	const { theme, toggleTheme, colors } = useTheme();

	return (
		<View style={[styles.container, { backgroundColor: colors.neutral[950] }]}>
			<View style={styles.section}>
				<Text style={[styles.sectionTitle, { color: colors.neutral[100] }]}>
					Appearance
				</Text>
				<TouchableOpacity
					style={[styles.option, { backgroundColor: colors.neutral[900] }]}
					onPress={toggleTheme}
				>
					<View style={styles.optionContent}>
						{theme === 'dark' ? (
							<Moon size={24} color={colors.neutral[400]} />
						) : (
							<Sun size={24} color={colors.neutral[400]} />
						)}
						<Text style={[styles.optionText, { color: colors.neutral[100] }]}>
							{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
						</Text>
					</View>
					<Switch
						value={theme === 'dark'}
						onValueChange={toggleTheme}
						trackColor={{
							false: colors.neutral[700],
							true: colors.primary[500],
						}}
						thumbColor={colors.neutral[50]}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	section: {
		padding: 16,
	},
	sectionTitle: {
		fontFamily: 'Inter-Bold',
		fontSize: 20,
		marginBottom: 16,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
		borderRadius: 12,
	},
	optionContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	optionText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		marginLeft: 12,
	},
});

export default SettingsScreen;
