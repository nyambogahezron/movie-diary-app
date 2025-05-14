import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Film, Star } from 'lucide-react-native';

export default function TrackAnimation() {
  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.posterContainer}
      >
        <View style={styles.poster}>
          <Film size={48} color="rgba(255, 255, 255, 0.3)" />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).duration(500)}
        style={styles.stars}
      >
        {[1, 2, 3, 4, 5].map((star, index) => (
          <Star
            key={star}
            size={24}
            fill={index < 4 ? '#FCD34D' : 'transparent'}
            color={index < 4 ? '#FCD34D' : '#6B7280'}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterContainer: {
    marginBottom: 24,
  },
  poster: {
    width: 160,
    height: 224,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    backgroundColor: '#374151',
    padding: 8,
    borderRadius: 16,
  },
});