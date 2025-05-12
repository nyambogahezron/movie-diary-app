import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type RatingStarsProps = {
  rating: number;
  size?: number;
  maxRating?: number;
};

export default function RatingStars({ 
  rating, 
  size = 16, 
  maxRating = 5 
}: RatingStarsProps) {
  return (
    <View style={styles.container}>
      {[...Array(maxRating)].map((_, index) => {
        // Full star
        if (index < Math.floor(rating)) {
          return (
            <Star 
              key={index} 
              size={size} 
              color={Colors.accent[500]} 
              fill={Colors.accent[500]} 
            />
          );
        }
        // Half star - not using half star for simplicity
        // else if (index < Math.ceil(rating) && rating % 1 !== 0) {
        //   return <HalfStar key={index} size={size} color={Colors.accent[500]} />;
        // }
        // Empty star
        return (
          <Star 
            key={index} 
            size={size} 
            color={Colors.neutral[600]} 
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});