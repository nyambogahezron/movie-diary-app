import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Film, Tv, ListFilter, BookOpenCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useLibrary } from '@/hooks/useLibrary';
import MediaListItem from '@/components/MediaListItem';
import EmptyState from '@/components/EmptyState';

type FilterType = 'all' | 'movies' | 'shows';
type SortType = 'recent' | 'rating' | 'title';

export default function LibraryScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('recent');
  const { watchedContent, watchlistContent, inProgressContent, isLoading } = useLibrary();

  const renderFilterButton = (type: FilterType, label: string, icon: JSX.Element) => (
    <TouchableOpacity 
      style={[styles.filterButton, activeFilter === type && styles.filterButtonActive]}
      onPress={() => setActiveFilter(type)}>
      {icon}
      <Text style={[styles.filterText, activeFilter === type && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSortButton = (type: SortType, label: string) => (
    <TouchableOpacity 
      style={[styles.sortButton, activeSort === type && styles.sortButtonActive]}
      onPress={() => setActiveSort(type)}>
      <Text style={[styles.sortText, activeSort === type && styles.sortTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Library</Text>
          <TouchableOpacity style={styles.filterIcon}>
            <ListFilter size={20} color={Colors.neutral[300]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderFilterButton('all', 'All', <BookOpenCheck size={16} color={activeFilter === 'all' ? Colors.primary[500] : Colors.neutral[400]} />)}
            {renderFilterButton('movies', 'Movies', <Film size={16} color={activeFilter === 'movies' ? Colors.primary[500] : Colors.neutral[400]} />)}
            {renderFilterButton('shows', 'TV Shows', <Tv size={16} color={activeFilter === 'shows' ? Colors.primary[500] : Colors.neutral[400]} />)}
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
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          {inProgressContent.length > 0 ? (
            <FlatList
              data={inProgressContent}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <MediaListItem 
                  media={item} 
                  progress={item.progress}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <EmptyState 
              message="No in-progress content" 
              subMessage="Content you're currently watching will appear here" 
            />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Watched</Text>
          {watchedContent.length > 0 ? (
            <FlatList
              data={watchedContent}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <MediaListItem 
                  media={item} 
                  rating={item.rating}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <EmptyState 
              message="No watched content" 
              subMessage="Movies and shows you've watched will appear here" 
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.neutral[50],
  },
  filterIcon: {
    padding: 8,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.neutral[900],
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[900],
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[400],
    marginLeft: 8,
  },
  filterTextActive: {
    color: Colors.primary[500],
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sortLabel: {
    fontFamily: 'Inter-Regular',
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
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: Colors.neutral[800],
  },
  sortText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[400],
  },
  sortTextActive: {
    color: Colors.neutral[100],
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
});