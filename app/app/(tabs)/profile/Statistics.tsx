import StatisticCard from '@/components/StatisticCard';
import WatchTimeChart from '@/components/WatchTimeChart';
import Colors from '@/constants/Colors';
import { useProfile } from '@/hooks/useProfile';
import { User } from '@/types/User';
import { Clock, Film, Star, Tv } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Stats = {
	totalWatchTime: string;
	averageRating: number;
	moviesWatched: number;
	showsWatched: number;
	watchTimeByMonth: Array<{ month: string; hours: number }>;
	topGenres: Array<{ name: string; count: number; color: string }>;
};

export default function StatisticsTab() {
	const { stats } = useProfile() as {
		user: User | null;
		stats: Stats | null;
		isLoading: boolean;
	};

	return (
		<ScrollView
			style={styles.tabContent}
			contentContainerStyle={styles.tabContentContainer}
			showsVerticalScrollIndicator={false}
		>
			<Text style={styles.sectionTitle}>Your Watching Time</Text>
			<WatchTimeChart data={stats?.watchTimeByMonth} />

			<View style={styles.statsRow}>
				<StatisticCard
					title='Total Watch Time'
					value={stats?.totalWatchTime || '0h'}
					icon={<Clock size={20} color={Colors.primary[500]} />}
				/>
				<StatisticCard
					title='Average Rating'
					value={stats?.averageRating?.toString() || '0'}
					icon={<Star size={20} color={Colors.accent[500]} />}
				/>
			</View>

			<View style={styles.statsRow}>
				<StatisticCard
					title='Movies Watched'
					value={stats?.moviesWatched?.toString() || '0'}
					icon={<Film size={20} color={Colors.success[500]} />}
				/>
				<StatisticCard
					title='TV Shows Watched'
					value={stats?.showsWatched?.toString() || '0'}
					icon={<Tv size={20} color={Colors.warning[500]} />}
				/>
			</View>

			<Text style={styles.sectionTitle}>Most Watched Genres</Text>
			<View style={styles.genresContainer}>
				{stats?.topGenres?.map((genre, index) => (
					<View key={index} style={styles.genreItem}>
						<View style={[styles.genreBadge, { backgroundColor: genre.color }]}>
							<Text style={styles.genreCount}>{genre.count}</Text>
						</View>
						<Text style={styles.genreName}>{genre.name}</Text>
					</View>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	tabContent: {
		flex: 1,
	},
	tabContentContainer: {
		padding: 16,
	},
	sectionTitle: {
		fontFamily: 'Inter-Medium',
		fontSize: 18,
		color: Colors.neutral[200],
		marginBottom: 16,
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	genresContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 16,
	},
	genreItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 16,
		marginBottom: 12,
	},
	genreBadge: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
	},
	genreCount: {
		fontFamily: 'Inter-Bold',
		fontSize: 12,
		color: Colors.neutral[950],
	},
	genreName: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.neutral[300],
	},
});
