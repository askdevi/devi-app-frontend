import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Flower } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface SetupProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function SetupProgress({ currentStep, totalSteps }: SetupProgressProps) {
  return (
    <View style={styles.container}>
      {Array(totalSteps).fill(0).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressItem,
            index < currentStep && styles.progressItemActive
          ]}
        >
          <Flower
            color={index < currentStep ? Colors.gold.DEFAULT : `${Colors.gold.DEFAULT}30`}
            size={20}
            strokeWidth={1.5}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  progressItem: {
    transform: [{ scale: 0.9 }],
  },
  progressItemActive: {
    transform: [{ scale: 1.1 }],
  },
});