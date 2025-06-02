import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, View } from 'react-native';

export default function Login() {
	const navigate = useRouter();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			navigate.push('/(tabs)');
		}
	}, [isAuthenticated, navigate]);

	return (
		<View className='min-h-screen flex-1'>
			<Image
				source={{
					uri: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
				}}
				className='absolute inset-0 bg-cover bg-center z-0'
				style={{ opacity: 0.9, flex: 1 }}
				blurRadius={4}
				resizeMode='cover'
			/>

			<View className='relative z-10 min-h-screen flex items-center justify-center px-4 py-20'>
				<AuthForm mode='signup' />
			</View>
		</View>
	);
}
