import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Plus, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Media } from '@/types/Media';

type MediaCardProps = {
  media: Media;
  type: 'movie' | 'tv';
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.38;

export default function MediaCard({ media, type }: MediaCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: media.posterUrl }} 
          style={styles.poster}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={Colors.neutral[950]} />
        </TouchableOpacity>
        {media.rating && (
          <View style={styles.ratingContainer}>
            <Star size={12} color={Colors.accent[500]} />
            <Text style={styles.ratingText}>{media.rating}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {media.title}
      </Text>
      <Text style={styles.year}>
        {media.year} • {type === 'movie' ? 'Movie' : 'TV Show'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 6,
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.accent[500],
    marginLeft: 4,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.neutral[100],
    marginBottom: 2,
  },
  year: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[400],
  },
});