import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { BarChart2, Calendar } from 'lucide-react-native';

export default function HistoryAnimation() {
  const bars = [
    { height: 64, delay: 100 },
    { height: 96, delay: 200 },
    { height: 128, delay: 300 },
    { height: 80, delay: 400 },
    { height: 112, delay: 500 },
  ];

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.card}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Activity</Text>
          <Calendar size={16} color="#A78BFA" />
        </View>

        <View style={styles.graph}>
          {bars.map((bar, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(bar.delay).duration(500)}
              style={[styles.bar, { height: bar.height }]}
            />
          ))}
        </View>

        <Animated.View
          entering={FadeInUp.delay(600).duration(500)}
          style={styles.stats}
        >
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Watched</Text>
            <Text style={styles.statValue}>127</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Hours</Text>
            <Text style={styles.statValue}>256</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Genres</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
        </Animated.View>
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
  card: {
    width: 224,
    height: 224,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  graph: {
    height: 144,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  bar: {
    width: 24,
    backgroundColor: '#8B5CF6',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    marginTop: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});