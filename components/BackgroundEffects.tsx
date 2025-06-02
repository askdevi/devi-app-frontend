import React, { useEffect, memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface StarProps {
  size: number;
  top: number;
  left: number;
  delay: number;
}

const Star = ({ size, top, left, delay }: StarProps) => {
  const opacity = useSharedValue(0.1);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 1500 + Math.random() * 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          top,
          left,
        },
        animatedStyle,
      ]}
    />
  );
};

const BackgroundEffects=memo(({ count = 30 }: { count?: number })=> {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 3,
    top: Math.random() * height,
    left: Math.random() * width,
    delay: Math.random() * 2000,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map((star) => (
        <Star
          key={star.id}
          size={star.size}
          top={star.top}
          left={star.left}
          delay={star.delay}
        />
      ))}
    </View>
  );
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderRadius: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default BackgroundEffects