import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
} from 'react-native';
import { SearchX } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type EmptyStateProps = {
  message: string;
  subMessage?: string;
  icon?: JSX.Element;
};

export default function EmptyState({ 
  message, 
  subMessage, 
  icon = <SearchX size={50} color={Colors.neutral[700]} /> 
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[900],
    borderRadius: 12,
    marginVertical: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[300],
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});