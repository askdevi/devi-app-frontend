import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MainLayout from '@/components/MainLayout';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
  const { dailyBlessings } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0219', '#1a0632', '#0a0219']}
        style={styles.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <MainLayout dailyBlessings={dailyBlessings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepPurple.DEFAULT,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});