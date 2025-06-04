import { useEffect, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

export const useFloatAnimation = (offset = -5, duration = 2000) => {
  const translateY = useSharedValue(0);

  const floatAnimation = useMemo(() => {
    return withRepeat(
      withSequence(
        withTiming(offset, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, [offset, duration]);

  useEffect(() => {
    translateY.value = floatAnimation;
    return () => cancelAnimation(translateY);
  }, [floatAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
};
