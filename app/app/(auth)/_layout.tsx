import { Stack } from 'expo-router';
import '../global.css';

export default function AuthLayout() {
	return <Stack screenOptions={{ headerShown: false }} />;
}
