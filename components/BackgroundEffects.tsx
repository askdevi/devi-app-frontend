import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

const BackgroundEffects = () => {
  const stars = useRef([...Array(30)].map(() => ({
    position: {
      left: Math.random() * width,
      top: Math.random() * height,
    },
    size: Math.random() * 2 + 1, // Smaller stars
    opacity: new Animated.Value(Math.random() * 0.5 + 0.1),
    duration: Math.random() * 2000 + 1000,
  }))).current;

  useEffect(() => {
    stars.forEach(star => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: star.duration,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: star.duration,
            useNativeDriver: true,
          }),
        ]).start(() => {
          animate(); // Continuous animation
        });
      };
      animate();
    });
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT]}
        style={styles.gradient}
        start={{ x: 0, y: -0.2 }} // Extended gradient upward
        end={{ x: 0, y: 1 }}
      />
      
      {stars.map((star, i) => (
        <Animated.View
          key={`star-${i}`}
          style={[
            styles.star,
            {
              left: star.position.left,
              top: star.position.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    marginTop: -50, // Extend container upward
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: height + 50, // Extend gradient height
  },
  star: {
    position: 'absolute',
    backgroundColor: Colors.gold.DEFAULT,
    borderRadius: 50,
    shadowColor: Colors.gold.DEFAULT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10, // Increased glow effect
    elevation: 5,
  },
});

export default BackgroundEffects;