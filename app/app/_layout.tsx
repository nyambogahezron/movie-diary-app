import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_700Bold,
	useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import './global.css';

function RootLayoutNav() {
	const { colors } = useTheme();

	useEffect(() => {
		SystemUI.setBackgroundColorAsync(colors.neutral[950]);
	}, [colors.neutral[950]]);

	return (
		<View style={{ flex: 1, backgroundColor: colors.neutral[950] }}>
			<StatusBar style={colors.neutral[950] === '#FFFFFF' ? 'dark' : 'light'} />
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: colors.neutral[950],
					},
					headerTintColor: colors.neutral[50],
					headerTitleStyle: {
						fontFamily: 'Inter-Bold',
					},
				}}
			>
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				<Stack.Screen name='media/[id]' options={{ headerShown: false }} />
				<Stack.Screen name='social/[id]' options={{ headerShown: false }} />
			</Stack>
		</View>
	);
}

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		'Inter-Regular': Inter_400Regular,
		'Inter-Medium': Inter_500Medium,
		'Inter-Bold': Inter_700Bold,
	});

	// if (!fontsLoaded) {
	// 	return <SplashScreen />;
	// }

	return (
		<ThemeProvider>
			<AuthProvider>
				<RootLayoutNav />
			</AuthProvider>
		</ThemeProvider>
	);
}
