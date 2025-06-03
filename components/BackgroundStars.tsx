import React from 'react';
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

// Generate star positions once outside the component
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 3,
    top: Math.random() * height,
    left: Math.random() * width,
    delay: Math.random() * 2000,
  }));
};

interface StarProps {
  size: number;
  top: number;
  left: number;
  delay: number;
}

function Star({ size, top, left, delay }: StarProps) {
  const opacity = useSharedValue(0.1);
  
  React.useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 1500 + Math.random() * 1000,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

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
}

// Generate stars once and reuse them
const STATIC_STARS = generateStars(30);

export default function BackgroundStars({ count = 30 }: { count?: number }) {
  return (
    <View style={styles.container}>
      {STATIC_STARS.slice(0, count).map((star) => (
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
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
});