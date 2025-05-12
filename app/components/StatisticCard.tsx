import React, { ReactNode } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
} from 'react-native';
import Colors from '@/constants/Colors';

type StatisticCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
};

export default function StatisticCard({ title, value, icon }: StatisticCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[900],
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.neutral[100],
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[400],
    textAlign: 'center',
  },
});