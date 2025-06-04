import MediaCard from '@/components/MediaCard';
import Colors from '@/constants/Colors';
import { useLibrary } from '@/hooks/useLibrary';
import { useRouter } from 'expo-router';
import { BarChart3, BookOpen, Clock, ListPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Styled wrapper for MediaCard
const StyledMediaCard = ({
	media,
	type,
}: {
	media: any;
	type: 'movie' | 'tv';
}) => (
	<View style={styles.mediaCard}>
		<MediaCard media={media} type={type} />
	</View>
);

export default function DashboardScreen() {
	const router = useRouter();
	const { watchedContent, watchlistContent } = useLibrary();
	const [stats] = useState({
		totalWatched: watchedContent.length,
		averageRating:
			watchedContent.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
				watchedContent.length || 0,
		thisMonth: 12, // TODO: Implement actual monthly count
		watchlistCount: watchlistContent.length,
	});

	// Get recently watched movies (last 5)
	const recentMovies = watchedContent.slice(0, 5);

	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			{/* Stats Section */}
			<View style={styles.statsContainer}>
				<View style={styles.statsHeader}>
					<BarChart3 size={24} color={Colors.primary[500]} />
					<Text style={styles.sectionTitle}>Your Stats</Text>
				</View>
				<View style={styles.statsGrid}>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{stats.totalWatched}</Text>
						<Text style={styles.statLabel}>Total Watched</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>
							{stats.averageRating.toFixed(1)}
						</Text>
						<Text style={styles.statLabel}>Avg. Rating</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{stats.thisMonth}</Text>
						<Text style={styles.statLabel}>This Month</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{stats.watchlistCount}</Text>
						<Text style={styles.statLabel}>Watchlist</Text>
					</View>
				</View>
			</View>

			{/* Recently Watched Section */}
			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<Clock size={24} color={Colors.primary[500]} />
					<Text style={styles.sectionTitle}>Recently Watched</Text>
					<Pressable onPress={() => router.push('/(tabs)/library')}>
						<Text style={styles.seeAll}>See All</Text>
					</Pressable>
				</View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.mediaScroll}
				>
					{recentMovies.map((movie) => (
						<StyledMediaCard key={movie.id} media={movie} type={movie.type} />
					))}
				</ScrollView>
			</View>

			{/* Diary Section */}
			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<BookOpen size={24} color={Colors.primary[500]} />
					<Text style={styles.sectionTitle}>Latest Diary Entries</Text>
					<Pressable onPress={() => router.push('/(tabs)/library')}>
						<Text style={styles.seeAll}>See All</Text>
					</Pressable>
				</View>
				<View style={styles.diaryContainer}>
					<Text style={styles.comingSoon}>
						Your diary entries will appear here
					</Text>
				</View>
			</View>

			{/* Watchlist Section */}
			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<ListPlus size={24} color={Colors.primary[500]} />
					<Text style={styles.sectionTitle}>Watchlist</Text>
					<Pressable onPress={() => router.push('/(tabs)/library')}>
						<Text style={styles.seeAll}>See All</Text>
					</Pressable>
				</View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.mediaScroll}
				>
					{watchlistContent.slice(0, 5).map((movie) => (
						<StyledMediaCard key={movie.id} media={movie} type={movie.type} />
					))}
				</ScrollView>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.neutral[950],
	},
	statsContainer: {
		padding: 16,
		backgroundColor: Colors.neutral[900],
		borderRadius: 12,
		margin: 16,
	},
	statsHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	statCard: {
		width: '48%',
		backgroundColor: Colors.neutral[800],
		padding: 16,
		borderRadius: 8,
		marginBottom: 12,
		alignItems: 'center',
	},
	statValue: {
		color: Colors.primary[500],
		fontSize: 24,
		fontFamily: 'Inter-Bold',
		marginBottom: 4,
	},
	statLabel: {
		color: Colors.neutral[400],
		fontSize: 14,
		fontFamily: 'Inter-Medium',
	},
	section: {
		marginBottom: 24,
		paddingHorizontal: 16,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	sectionTitle: {
		color: Colors.neutral[50],
		fontSize: 20,
		fontFamily: 'Inter-Bold',
		marginLeft: 8,
		flex: 1,
	},
	seeAll: {
		color: Colors.primary[500],
		fontSize: 14,
		fontFamily: 'Inter-Medium',
	},
	mediaScroll: {
		marginHorizontal: -16,
		paddingHorizontal: 16,
	},
	mediaCard: {
		marginRight: 12,
		width: 140,
	},
	diaryContainer: {
		backgroundColor: Colors.neutral[900],
		borderRadius: 12,
		padding: 16,
		minHeight: 120,
		justifyContent: 'center',
		alignItems: 'center',
	},
	comingSoon: {
		color: Colors.neutral[400],
		fontSize: 14,
		fontFamily: 'Inter-Medium',
	},
});
