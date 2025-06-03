import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import {
	Pressable,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

interface AuthFormProps {
	mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
	const { login, signup } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		setError('');

		if (!email || !password) {
			setError('Please enter both email and password');
			return;
		}

		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address');
			return;
		}

		// Password validation
		if (password.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}

		setIsLoading(true);

		try {
			let success;

			if (mode === 'login') {
				success = await login(email, password);
			} else {
				success = await signup(email, password);
			}

			if (success) {
				router.replace('/(tabs)');
			} else {
				setError(
					mode === 'login'
						? 'Invalid email or password'
						: 'Could not create account. Try a different email address.'
				);
			}
		} catch (error) {
			setError('An unexpected error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View className='w-full max-w-md bg-black/75 rounded-md p-8 md:p-12'>
			<Text className='text-white text-3xl font-bold mb-6'>
				{mode === 'login' ? 'Sign In' : 'Sign Up'}
			</Text>

			{error && (
				<View className='bg-red-900/60 p-3 rounded mb-4'>
					<Text className='text-white'>{error}</Text>
				</View>
			)}

			<View>
				<View className='mb-4'>
					<Text className='relative'>
						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder='Email'
							placeholderTextColor='#9ca3af'
							onFocus={() => setError('')}
							autoCapitalize='none'
							autoComplete='email'
							autoCorrect={false}
							keyboardType='email-address'
							style={{ fontFamily: 'Inter-Regular' }}
							className='w-full bg-gray-700 text-white px-4 py-3 rounded'
						/>
					</Text>
				</View>

				<View className='mb-6'>
					<View className='relative'>
						<TextInput
							secureTextEntry={!showPassword}
							value={password}
							onChangeText={setPassword}
							placeholderTextColor='#9ca3af'
							onFocus={() => setError('')}
							autoCapitalize='none'
							autoComplete='password'
							autoCorrect={false}
							style={{ fontFamily: 'Inter-Regular' }}
							placeholder='Password'
							className='w-full bg-gray-700 text-white px-4 py-3 rounded'
						/>
						<TouchableOpacity
							onPress={() => setShowPassword(!showPassword)}
							className='absolute right-3 top-1/2 -translate-y-1/2'
						>
							{showPassword ? (
								<EyeOff size={20} color='#9ca3af' />
							) : (
								<Eye size={20} color='#9ca3af' />
							)}
						</TouchableOpacity>
					</View>
				</View>

				<Pressable
					onPress={handleSubmit}
					disabled={isLoading}
					className={`w-full bg-red-600 py-3 rounded ${
						isLoading ? 'opacity-70' : ''
					}`}
				>
					<View className='flex items-center justify-center'>
						<Text className='text-white font-semibold'>
							{isLoading
								? 'Loading...'
								: mode === 'login'
								? 'Sign In'
								: 'Sign Up'}
						</Text>
					</View>
				</Pressable>
			</View>

			<View className='mt-6'>
				{mode === 'login' ? (
					<View className='flex-row'>
						<Text className='text-gray-400'>New to Movie Diary? </Text>
						<Pressable onPress={() => router.push('/register')}>
							<Text className='text-white'>Sign up now</Text>
						</Pressable>
					</View>
				) : (
					<View className='flex-row'>
						<Text className='text-gray-400'>Already have an account? </Text>
						<Pressable onPress={() => router.push('/login')}>
							<Text className='text-white'>Sign in</Text>
						</Pressable>
					</View>
				)}
			</View>
		</View>
	);
}
