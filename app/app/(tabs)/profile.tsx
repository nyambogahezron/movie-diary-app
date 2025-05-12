import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
} from 'react-native';
import { 
  Settings, 
  ChevronRight, 
  Clock, 
  Star, 
  Calendar, 
  Film, 
  Tv 
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useProfile } from '@/hooks/useProfile';
import UserAvatar from '@/components/UserAvatar';
import StatisticCard from '@/components/StatisticCard';
import WatchTimeChart from '@/components/WatchTimeChart';

export default function ProfileScreen() {
  const { user, stats, isLoading } = useProfile();
  const [activeSection, setActiveSection] = useState('stats');

  const renderSectionButton = (section: string, label: string) => (
    <TouchableOpacity 
      style={[
        styles.sectionButton, 
        activeSection === section && styles.activeSectionButton
      ]}
      onPress={() => setActiveSection(section)}>
      <Text 
        style={[
          styles.sectionButtonText, 
          activeSection === section && styles.activeSectionButtonText
        ]}>
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
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.neutral[300]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileHeader}>
          <UserAvatar user={user} size={80} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileUsername}>@{user?.username}</Text>
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatNumber}>{user?.watched || 0}</Text>
                <Text style={styles.profileStatLabel}>Watched</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatNumber}>{user?.followers || 0}</Text>
                <Text style={styles.profileStatLabel}>Followers</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatNumber}>{user?.following || 0}</Text>
                <Text style={styles.profileStatLabel}>Following</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionsContainer}>
          {renderSectionButton('stats', 'Statistics')}
          {renderSectionButton('activity', 'Activity')}
          {renderSectionButton('lists', 'Lists')}
        </View>
        
        {activeSection === 'stats' && (
          <>
            <Text style={styles.sectionTitle}>Your Watching Time</Text>
            <WatchTimeChart data={stats?.watchTimeByMonth} />
            
            <View style={styles.statsRow}>
              <StatisticCard 
                title="Total Watch Time" 
                value={stats?.totalWatchTime || '0h'} 
                icon={<Clock size={20} color={Colors.primary[500]} />} 
              />
              <StatisticCard 
                title="Average Rating" 
                value={stats?.averageRating?.toString() || '0'} 
                icon={<Star size={20} color={Colors.accent[500]} />} 
              />
            </View>
            
            <View style={styles.statsRow}>
              <StatisticCard 
                title="Movies Watched" 
                value={stats?.moviesWatched?.toString() || '0'} 
                icon={<Film size={20} color={Colors.success[500]} />} 
              />
              <StatisticCard 
                title="TV Shows Watched" 
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
          </>
        )}
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
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.neutral[50],
  },
  settingsButton: {
    padding: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.neutral[50],
    marginBottom: 4,
  },
  profileUsername: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[400],
    marginBottom: 12,
  },
  profileStats: {
    flexDirection: 'row',
  },
  profileStat: {
    marginRight: 24,
  },
  profileStatNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.neutral[100],
    marginBottom: 2,
  },
  profileStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  sectionsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[900],
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  sectionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSectionButton: {
    backgroundColor: Colors.neutral[800],
  },
  sectionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[400],
  },
  activeSectionButtonText: {
    color: Colors.neutral[100],
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