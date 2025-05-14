import { Profile, User } from '@/types';
import {
	clearUser,
	getCurrentProfile,
	getUser,
	initializeLocalStorage,
	setCurrentProfile,
	setUser,
} from '@/utils/localStorage';
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

interface AuthContextType {
	user: User | null;
	currentProfile: Profile | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	signup: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	selectProfile: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUserState] = useState<User | null>(null);
	const [currentProfile, setCurrentProfileState] = useState<Profile | null>(
		null
	);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// Initialize auth state from localStorage
	useEffect(() => {
		initializeLocalStorage();
		const fetchStoredData = async () => {
			const storedUser = await getUser();
			const storedProfile = await getCurrentProfile();

			if (storedUser) {
				setUserState(storedUser);
				setIsAuthenticated(true);

				if (storedProfile) {
					setCurrentProfileState(storedProfile);
				}
			}
		};

		fetchStoredData();
	}, []);

	// Mock login function (in a real app, this would call an API)
	const login = async (email: string, password: string): Promise<boolean> => {
		// Simple validation (in a real app, this would verify credentials with a server)
		if (email && password.length >= 6) {
			const storedUser = await getUser();

			if (storedUser && storedUser.email === email) {
				setUserState(storedUser);
				setIsAuthenticated(true);
				return true;
			} else {
				// For demo purposes, we'll treat any valid format as successful login
				const newUser: User = {
					id: '1',
					email,
					profiles: [
						{
							id: '1',
							name: 'Main Profile',
							avatar:
								'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
						},
						{
							id: '2',
							name: 'Kids',
							avatar:
								'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
						},
					],
				};

				setUser(newUser);
				setUserState(newUser);
				setIsAuthenticated(true);
				return true;
			}
		}

		return false;
	};

	// Mock signup function
	const signup = async (email: string, password: string): Promise<boolean> => {
		// Simple validation
		if (email && password.length >= 6) {
			const newUser: User = {
				id: '1',
				email,
				profiles: [
					{
						id: '1',
						name: 'Main Profile',
						avatar:
							'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
					},
				],
			};

			setUser(newUser);
			setUserState(newUser);
			setIsAuthenticated(true);
			return true;
		}

		return false;
	};

	const logout = () => {
		clearUser();
		setUserState(null);
		setCurrentProfileState(null);
		setIsAuthenticated(false);
	};

	const selectProfile = (profile: Profile) => {
		setCurrentProfile(profile);
		setCurrentProfileState(profile);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				currentProfile,
				isAuthenticated,
				login,
				signup,
				logout,
				selectProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
