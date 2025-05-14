import { router } from 'expo-router';
import { Film } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Onboarding from '../components/onboarding';

export default function Index() {
	const [onboardingComplete, setOnboardingComplete] = useState(false);

	const handleComplete = useCallback(() => {
		setOnboardingComplete(true);
	}, []);

	if (!onboardingComplete) {
		return <Onboarding onComplete={handleComplete} />;
	}

	return (
		<View style={styles.container}>
			<Film size={64} color='#8B5CF6' style={styles.icon} />
			<Text style={styles.title}>Welcome to MovieDiary</Text>
			<Text style={styles.subtitle}>
				Your personal movie journey begins here.
			</Text>
			<TouchableOpacity style={styles.button} activeOpacity={0.8}>
				<Text style={styles.buttonText}>Get Started</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.button, { marginTop: 16 }]}
				onPress={() => router.push('/login')}
				activeOpacity={0.8}
			>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
		backgroundColor: '#111827',
	},
	icon: {
		marginBottom: 24,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 16,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 18,
		color: '#9CA3AF',
		marginBottom: 32,
		textAlign: 'center',
	},
	button: {
		backgroundColor: '#8B5CF6',
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 9999,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
