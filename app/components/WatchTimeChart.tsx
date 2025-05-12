import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import Colors from '@/constants/Colors';

type ChartData = {
  month: string;
  hours: number;
}[];

type WatchTimeChartProps = {
  data?: ChartData;
};

const DEFAULT_DATA: ChartData = [
  { month: 'Jan', hours: 12 },
  { month: 'Feb', hours: 18 },
  { month: 'Mar', hours: 8 },
  { month: 'Apr', hours: 15 },
  { month: 'May', hours: 22 },
  { month: 'Jun', hours: 30 },
];

const { width } = Dimensions.get('window');
const BAR_WIDTH = (width - 64) / 6 - 10;

export default function WatchTimeChart({ data = DEFAULT_DATA }: WatchTimeChartProps) {
  // Find max value for scaling
  const maxHours = Math.max(...data.map(item => item.hours));
  
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const barHeight = (item.hours / maxHours) * 150;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barLabelContainer}>
                <Text style={styles.barValue}>{item.hours}h</Text>
              </View>
              <View style={[styles.bar, { height: barHeight }]} />
              <Text style={styles.barLabel}>{item.month}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral[900],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
    width: BAR_WIDTH,
  },
  barLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    width: BAR_WIDTH,
    backgroundColor: Colors.primary[500],
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[400],
    marginTop: 8,
  },
  barValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[300],
    marginBottom: 4,
  },
});