import React from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Text,
} from 'react-native';
import Colors from '@/constants/Colors';
import { User } from '@/types/User';

type UserAvatarProps = {
  user?: User;
  size?: number;
};

export default function UserAvatar({ user, size = 40 }: UserAvatarProps) {
  if (!user) {
    return (
      <View 
        style={[
          styles.placeholderContainer, 
          { width: size, height: size, borderRadius: size / 2 }
        ]}>
        <Text style={styles.placeholderText}>?</Text>
      </View>
    );
  }

  if (user.avatar) {
    return (
      <Image 
        source={{ uri: user.avatar }} 
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 }
        ]}
      />
    );
  }

  // Generate initials
  const initials = user.name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View 
      style={[
        styles.initialsContainer, 
        { width: size, height: size, borderRadius: size / 2 }
      ]}>
      <Text 
        style={[
          styles.initialsText,
          { fontSize: size * 0.4 }
        ]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.neutral[800],
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[800],
  },
  initialsText: {
    fontFamily: 'Inter-Medium',
    color: Colors.primary[200],
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[800],
  },
  placeholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[500],
  },
});