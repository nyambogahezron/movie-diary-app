import EmptyState from '@/components/EmptyState';
import FilterModal from '@/components/FilterModal';
import MediaListItem from '@/components/MediaListItem';
import Colors from '@/constants/Colors';
import { useLibrary } from '@/hooks/useLibrary';
import { Media } from '@/types/Media';
import { BookOpenCheck, Film, Tv } from 'lucide-react-native';
import { ReactElement, useMemo, useState } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

type FilterType = 'all' | 'movies' | 'shows';
type SortType = 'recent' | 'rating' | 'title';

export default function LibraryScreen() {
	const [activeFilter, setActiveFilter] = useState<FilterType>('all');
	const [activeSort, setActiveSort] = useState<SortType>('recent');
	const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string[]>
	>({});
	const { watchedContent, watchlistContent, inProgressContent, isLoading } =
		useLibrary();

	const renderFilterButton = (
		type: FilterType,
		label: string,
		icon: ReactElement
	) => (
		<TouchableOpacity
			style={[
				styles.filterButton,
				activeFilter === type && styles.filterButtonActive,
			]}
			onPress={() => setActiveFilter(type)}
		>
			{icon}
			<Text
				style={[
					styles.filterButtonText,
					activeFilter === type && styles.filterButtonTextActive,
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);

	const renderSortButton = (type: SortType, label: string) => (
		<TouchableOpacity
			style={[
				styles.sortButton,
				activeSort === type && styles.sortButtonActive,
			]}
			onPress={() => setActiveSort(type)}
		>
			<Text
				style={[
					styles.sortButtonText,
					activeSort === type && styles.sortButtonTextActive,
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);

	const filterAndSortContent = (content: Media[]) => {
		return content
			.filter((item) => {
				// Apply type filter (movies/shows)
				if (activeFilter === 'movies' && item.type !== 'movie') return false;
				if (activeFilter === 'shows' && item.type !== 'tv') return false;

				// Apply additional filters
				if (selectedFilters['Genre']?.length) {
					const hasMatchingGenre = item.genres?.some((genre) =>
						selectedFilters['Genre'].includes(genre.toLowerCase())
					);
					if (!hasMatchingGenre) return false;
				}

				if (selectedFilters['Year']?.length) {
					const year = item.year.toString();
					if (
						!selectedFilters['Year'].includes(year) &&
						!(year < '2020' && selectedFilters['Year'].includes('older'))
					) {
						return false;
					}
				}

				if (selectedFilters['Rating']?.length) {
					const rating = item.rating || 0;
					const minRating = parseInt(
						selectedFilters['Rating'][0].replace('plus', '')
					);
					if (rating < minRating) return false;
				}

				return true;
			})
			.sort((a, b) => {
				switch (activeSort) {
					case 'rating':
						return (b.rating || 0) - (a.rating || 0);
					case 'title':
						return a.title.localeCompare(b.title);
					case 'recent':
					default:
						return b.year - a.year;
				}
			});
	};

	const filteredWatchedContent = useMemo(
		() => filterAndSortContent(watchedContent),
		[watchedContent, activeFilter, activeSort, selectedFilters]
	);

	const filteredWatchlistContent = useMemo(
		() => filterAndSortContent(watchlistContent),
		[watchlistContent, activeFilter, activeSort, selectedFilters]
	);

	const filteredInProgressContent = useMemo(
		() => filterAndSortContent(inProgressContent),
		[inProgressContent, activeFilter, activeSort, selectedFilters]
	);

	const handleApplyFilters = (filters: Record<string, string[]>) => {
		setSelectedFilters(filters);
	};

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.filtersContainer}>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{renderFilterButton(
							'all',
							'All',
							<BookOpenCheck
								size={16}
								color={
									activeFilter === 'all'
										? Colors.primary[500]
										: Colors.neutral[400]
								}
							/>
						)}
						{renderFilterButton(
							'movies',
							'Movies',
							<Film
								size={16}
								color={
									activeFilter === 'movies'
										? Colors.primary[500]
										: Colors.neutral[400]
								}
							/>
						)}
						{renderFilterButton(
							'shows',
							'TV Shows',
							<Tv
								size={16}
								color={
									activeFilter === 'shows'
										? Colors.primary[500]
										: Colors.neutral[400]
								}
							/>
						)}
					</ScrollView>
				</View>

				<View style={styles.sortContainer}>
					<Text style={styles.sortLabel}>Sort by:</Text>
					<View style={styles.sortButtons}>
						{renderSortButton('recent', 'Recent')}
						{renderSortButton('rating', 'Rating')}
						{renderSortButton('title', 'Title')}
					</View>
				</View>

				{Object.keys(selectedFilters).length > 0 && (
					<View style={styles.activeFiltersContainer}>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{Object.entries(selectedFilters).map(([section, values]) =>
								values.map((value) => (
									<View
										key={`${section}-${value}`}
										style={styles.activeFilterChip}
									>
										<Text style={styles.activeFilterText}>
											{section}: {value}
										</Text>
										<TouchableOpacity
											onPress={() => {
												setSelectedFilters((prev) => ({
													...prev,
													[section]: prev[section].filter((v) => v !== value),
												}));
											}}
											style={styles.removeFilterButton}
										>
											<Text style={styles.removeFilterText}>×</Text>
										</TouchableOpacity>
									</View>
								))
							)}
						</ScrollView>
					</View>
				)}

				{isLoading ? (
					<View style={styles.loadingContainer}>
						<Text style={styles.loadingText}>Loading your library...</Text>
					</View>
				) : (
					<>
						{filteredWatchedContent.length > 0 && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Watched</Text>
								{filteredWatchedContent.map((item) => (
									<MediaListItem
										key={item.id}
										media={item}
										rating={item.rating}
									/>
								))}
							</View>
						)}

						{filteredInProgressContent.length > 0 && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>In Progress</Text>
								{filteredInProgressContent.map((item) => (
									<MediaListItem
										key={item.id}
										media={item}
										progress={item.progress}
									/>
								))}
							</View>
						)}

						{filteredWatchlistContent.length > 0 && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Watchlist</Text>
								{filteredWatchlistContent.map((item) => (
									<MediaListItem key={item.id} media={item} />
								))}
							</View>
						)}

						{filteredWatchedContent.length === 0 &&
							filteredInProgressContent.length === 0 &&
							filteredWatchlistContent.length === 0 && (
								<EmptyState
									message='No content found'
									subMessage='Try adjusting your filters or add some content to your library'
								/>
							)}
					</>
				)}
			</ScrollView>

			<FilterModal
				visible={isFilterModalVisible}
				onClose={() => setIsFilterModalVisible(false)}
				onApply={handleApplyFilters}
				initialFilters={selectedFilters}
			/>
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
		paddingTop: 16,
		paddingBottom: 32,
	},
	filtersContainer: {
		marginBottom: 16,
	},
	filterButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		marginRight: 8,
		backgroundColor: Colors.neutral[900],
	},
	filterButtonActive: {
		backgroundColor: Colors.primary[900],
	},
	filterButtonText: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.neutral[400],
		marginLeft: 6,
	},
	filterButtonTextActive: {
		color: Colors.primary[500],
	},
	sortContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 24,
	},
	sortLabel: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.neutral[400],
		marginRight: 12,
	},
	sortButtons: {
		flexDirection: 'row',
	},
	sortButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		marginRight: 8,
		backgroundColor: Colors.neutral[900],
	},
	sortButtonActive: {
		backgroundColor: Colors.primary[900],
	},
	sortButtonText: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.neutral[400],
	},
	sortButtonTextActive: {
		color: Colors.primary[500],
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontFamily: 'Inter-Medium',
		fontSize: 18,
		color: Colors.neutral[200],
		marginBottom: 16,
	},
	activeFiltersContainer: {
		marginBottom: 16,
	},
	activeFilterChip: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.primary[900],
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		marginRight: 8,
	},
	activeFilterText: {
		fontFamily: 'Inter-Medium',
		fontSize: 13,
		color: Colors.primary[500],
	},
	removeFilterButton: {
		marginLeft: 4,
		paddingHorizontal: 4,
	},
	removeFilterText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.primary[500],
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 32,
	},
	loadingText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[400],
	},
});
