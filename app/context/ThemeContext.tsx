import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	colors: typeof Colors;
}

const lightColors = {
	primary: Colors.primary,
	accent: Colors.accent,
	success: Colors.success,
	warning: Colors.warning,
	error: Colors.error,
	neutral: {
		50: '#111827',
		100: '#1F2937',
		200: '#374151',
		300: '#4B5563',
		400: '#6B7280',
		500: '#9CA3AF',
		600: '#D1D5DB',
		700: '#E5E7EB',
		800: '#F3F4F6',
		900: '#F9FAFB',
		950: '#FFFFFF',
	},
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		// Load saved theme preference
		loadTheme();
	}, []);

	const loadTheme = async () => {
		try {
			const savedTheme = await AsyncStorage.getItem('theme');
			if (savedTheme) {
				setTheme(savedTheme as Theme);
			}
		} catch (error) {
			console.error('Error loading theme:', error);
		}
	};

	const toggleTheme = async () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		try {
			await AsyncStorage.setItem('theme', newTheme);
		} catch (error) {
			console.error('Error saving theme:', error);
		}
	};

	const colors = theme === 'dark' ? Colors : lightColors;

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
