import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MainLayout from '@/components/MainLayout';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <MainLayout />
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