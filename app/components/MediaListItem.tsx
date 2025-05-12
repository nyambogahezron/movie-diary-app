import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Media } from '@/types/Media';
import RatingStars from './RatingStars';

type MediaListItemProps = {
  media: Media;
  rating?: number;
  progress?: {
    current: number;
    total: number;
  };
};

export default function MediaListItem({ media, rating, progress }: MediaListItemProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <Image 
        source={{ uri: media.posterUrl }} 
        style={styles.poster}
        resizeMode="cover"
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {media.title}
        </Text>
        <Text style={styles.info} numberOfLines={1}>
          {media.year} • {media.type === 'movie' ? 'Movie' : 'TV Show'}
        </Text>
        
        {rating && (
          <View style={styles.ratingContainer}>
            <RatingStars rating={rating} size={14} />
            <Text style={styles.ratingText}>{rating}/5</Text>
          </View>
        )}
        
        {progress && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(progress.current / progress.total) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progress.current}/{progress.total} {media.type === 'movie' ? 'min' : 'eps'}
            </Text>
          </View>
        )}
      </View>
      
      <ChevronRight size={20} color={Colors.neutral[500]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[900],
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[100],
    marginBottom: 4,
  },
  info: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[400],
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.accent[500],
    marginLeft: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral[800],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[400],
  },
});