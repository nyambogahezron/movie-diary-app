import { AuthProvider } from '@/context/AuthContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_700Bold,
	useFonts,
} from '@expo-google-fonts/inter';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import './global.css';

SystemUI.setBackgroundColorAsync('#030712');

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	useFrameworkReady();

	const [fontsLoaded, fontError] = useFonts({
		'Inter-Regular': Inter_400Regular,
		'Inter-Medium': Inter_500Medium,
		'Inter-Bold': Inter_700Bold,
	});

	useEffect(() => {
		SplashScreen.hideAsync();
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded) {
		return null;
	}
	if (fontError) {
		console.error('Error loading fonts:', fontError);
		return null;
	}

	return (
		<View style={{ flex: 1 }}>
			<AuthProvider>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name='index' options={{ headerShown: false }} />
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen name='+not-found' />
				</Stack>
				<StatusBar style='auto' />
			</AuthProvider>
		</View>
	);
}
