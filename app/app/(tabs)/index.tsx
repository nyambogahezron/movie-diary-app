import MediaCard from '@/components/MediaCard';
import SearchBar from '@/components/SearchBar';
import Colors from '@/constants/Colors';
import { useTrendingContent } from '@/hooks/useTrendingContent';
import { TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function DiscoverScreen() {
	const { trendingMovies, trendingShows, isLoading, error } =
		useTrendingContent();
	const [searchQuery, setSearchQuery] = useState('');

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Oops! Something went wrong.</Text>
				<Text style={styles.errorSubtext}>{error}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<Text style={styles.title}>ScreenDiary</Text>
					<Text style={styles.subtitle}>
						Discover and track your entertainment
					</Text>
				</View>

				<SearchBar
					value={searchQuery}
					onChangeText={setSearchQuery}
					placeholder='Search movies, TV shows...'
					onSubmit={() => console.log('Search for:', searchQuery)}
				/>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<TrendingUp size={20} color={Colors.primary[500]} />
						<Text style={styles.sectionTitle}>Trending Movies</Text>
					</View>

					{isLoading ? (
						<ActivityIndicator
							size='large'
							color={Colors.primary[500]}
							style={styles.loader}
						/>
					) : (
						<FlatList
							horizontal
							showsHorizontalScrollIndicator={false}
							data={trendingMovies}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => <MediaCard media={item} type='movie' />}
							style={styles.list}
							contentContainerStyle={styles.listContent}
						/>
					)}
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<TrendingUp size={20} color={Colors.primary[500]} />
						<Text style={styles.sectionTitle}>Trending TV Shows</Text>
					</View>

					{isLoading ? (
						<ActivityIndicator
							size='large'
							color={Colors.primary[500]}
							style={styles.loader}
						/>
					) : (
						<FlatList
							horizontal
							showsHorizontalScrollIndicator={false}
							data={trendingShows}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => <MediaCard media={item} type='tv' />}
							style={styles.list}
							contentContainerStyle={styles.listContent}
						/>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.neutral[950],
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		paddingTop: 48,
		paddingBottom: 32,
	},
	header: {
		marginBottom: 24,
	},
	title: {
		fontFamily: 'Inter-Bold',
		fontSize: 28,
		color: Colors.neutral[50],
		marginBottom: 4,
	},
	subtitle: {
		fontFamily: 'Inter-Regular',
		fontSize: 16,
		color: Colors.neutral[400],
	},
	section: {
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	sectionTitle: {
		fontFamily: 'Inter-Medium',
		fontSize: 18,
		color: Colors.neutral[100],
		marginLeft: 8,
	},
	list: {
		marginLeft: -8,
	},
	listContent: {
		paddingLeft: 8,
		paddingRight: 16,
	},
	loader: {
		marginVertical: 32,
	},
	errorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.neutral[950],
		padding: 24,
	},
	errorText: {
		fontFamily: 'Inter-Bold',
		fontSize: 20,
		color: Colors.neutral[100],
		marginBottom: 8,
	},
	errorSubtext: {
		fontFamily: 'Inter-Regular',
		fontSize: 16,
		color: Colors.neutral[400],
		textAlign: 'center',
	},
});
