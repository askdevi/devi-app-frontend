import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MainLayout from '@/components/MainLayout';

export default function HomeScreen() {

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0219', '#1a0632', '#0a0219']}
        style={styles.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <MainLayout />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "hsl(274, 100%, 10%)",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});