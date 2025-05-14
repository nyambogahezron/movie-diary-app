import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, User, WatchHistoryItem, WatchlistItem } from '../types';
import { defaultUser, defaultWatchHistory, defaultWatchlist } from './mockData';

// Local Storage Keys
const USER_KEY = 'netflix_clone_user';
const CURRENT_PROFILE_KEY = 'netflix_clone_current_profile';
const WATCH_HISTORY_KEY = 'netflix_clone_watch_history';
const WATCHLIST_KEY = 'netflix_clone_watchlist';

// User related functions
export const getUser = async (): Promise<User | null> => {
	const userJson = await AsyncStorage.getItem(USER_KEY);
	if (!userJson) return null;
	return JSON.parse(userJson);
};

export const setUser = (user: User): void => {
	AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const initializeUser = (): void => {
	if (!getUser()) {
		setUser(defaultUser);
		setWatchHistory(defaultWatchHistory);
		setWatchlist(defaultWatchlist);
	}
};

export const clearUser = (): void => {
	AsyncStorage.removeItem(USER_KEY);
	AsyncStorage.removeItem(CURRENT_PROFILE_KEY);
};

// Profile functions
export const getCurrentProfile = async (): Promise<Profile | null> => {
	const profileJson = await AsyncStorage.getItem(CURRENT_PROFILE_KEY);
	if (!profileJson) return null;
	return JSON.parse(profileJson);
};

export const setCurrentProfile = (profile: Profile): void => {
	AsyncStorage.setItem(CURRENT_PROFILE_KEY, JSON.stringify(profile));
};

// Watch history functions
export const getWatchHistory = async (): Promise<WatchHistoryItem[]> => {
	const historyJson = await AsyncStorage.getItem(WATCH_HISTORY_KEY);
	if (!historyJson) return [];
	return JSON.parse(historyJson);
};

export const setWatchHistory = (history: WatchHistoryItem[]): void => {
	AsyncStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
};

export const addToWatchHistory = async (
	item: WatchHistoryItem
): Promise<void> => {
	const history = await getWatchHistory();

	// Remove existing entry for the same content and profile if it exists
	const filteredHistory = history.filter(
		(h) => !(h.contentId === item.contentId && h.profileId === item.profileId)
	);

	// Add the new item
	filteredHistory.push(item);

	setWatchHistory(filteredHistory);
};

export const getProfileWatchHistory = async (
	profileId: string
): Promise<WatchHistoryItem[]> => {
	const history = await getWatchHistory();
	return history.filter((item) => item.profileId === profileId);
};

// Watchlist functions
export const getWatchlist = async (): Promise<WatchlistItem[]> => {
	const watchlistJson = await AsyncStorage.getItem(WATCHLIST_KEY);
	if (!watchlistJson) return [];
	return JSON.parse(watchlistJson);
};

export const setWatchlist = (watchlist: WatchlistItem[]): void => {
	AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

export const addToWatchlist = async (
	contentId: string,
	profileId: string
): Promise<void> => {
	const watchlist = await getWatchlist();

	// Check if item is already in watchlist
	if (
		watchlist.some(
			(item) => item.contentId === contentId && item.profileId === profileId
		)
	) {
		return;
	}

	// Add to watchlist
	watchlist.push({
		contentId,
		profileId,
		addedAt: Date.now(),
	});

	setWatchlist(watchlist);
};

export const removeFromWatchlist = async (
	contentId: string,
	profileId: string
): Promise<void> => {
	let watchlist = await getWatchlist();

	watchlist = watchlist.filter(
		(item) => !(item.contentId === contentId && item.profileId === profileId)
	);

	setWatchlist(watchlist);
};

export const getProfileWatchlist = async (
	profileId: string
): Promise<WatchlistItem[]> => {
	const watchlist = await getWatchlist();
	return watchlist.filter((item) => item.profileId === profileId);
};

// Initialize mock data if needed
export const initializeLocalStorage = (): void => {
	initializeUser();
};
