import React, { useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ContinueButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  label?: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  onPress,
  disabled = false,
  label = 'Continue',
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const shimmer = useSharedValue(0);

  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.8]),
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [0, 1], [-150, 150]),
      },
    ],
  }));

useEffect(() => {
  // Slower glow (3s)
  glow.value = withRepeat(
    withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );

  // Slower shimmer (5s)
  shimmer.value = withRepeat(
    withTiming(1, {
      duration: 5000,
      easing: Easing.linear,
    }),
    -1,
    false
  );
}, []);

  const handlePress = () => {
    if (disabled) return;

    scale.value = withSequence(
      withTiming(0.76, { duration: 100, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) })
    );

    runOnJS(onPress)(null as any);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        disabled && styles.disabled,
        animatedScale,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={disabled}
      >
        <View style={styles.gradientWrapper}>
          <LinearGradient
            colors={['#FFD700', '#FF8C00', '#FFD700']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />

          <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
            <LinearGradient
              colors={[
                'transparent', 
                // 'rgba(255,255,255,0.1)',
                'rgba(255,255,255,0.3)',
                // 'rgba(255,255,255,0.1)',
                 'transparent'
                ]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>

          <View style={styles.content}>
            <Text style={styles.label}>{label}</Text>
            <ArrowRight color={Colors.deepPurple.DEFAULT} size={20} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 8,
    marginTop: 24,
    shadowColor: Colors.gold.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  touchable: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientWrapper: {
    flex: 1,
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.deepPurple.DEFAULT,
    marginRight: 8,
  },
});

export default ContinueButton;
