import React, { useEffect, useMemo } from 'react';
import { Text, Pressable, StyleSheet, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

interface ShinyButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  linerColors?: string[]; // gradient colors
}

const ShinyButton: React.FC<ShinyButtonProps> = ({
  title,
  onPress,
  style,
  linerColors = ['#FFD700', '#FFAA00'],
}) => {
  const buttonGradient = useSharedValue(0);

  const animation = useMemo(() => {
    return withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        withTiming(0, { duration: 2000, easing: Easing.linear })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    buttonGradient.value = animation;
    return () => cancelAnimation(buttonGradient);
  }, [animation]);

  const shineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(buttonGradient.value, [0, 1], [-100, 200]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <LinearGradient
        colors={linerColors as [ColorValue, ColorValue, ...ColorValue[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{title}</Text>
        <Animated.View style={[styles.shine, shineStyle]} />
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    color: '#3D2B8E',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    zIndex: 1,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-25deg' }],
    borderRadius: 60,
  },
});

export default ShinyButton;
