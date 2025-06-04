import React, { memo, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import OrbitingStars from '@/components/orbitingStars';
import RippleRings from '@/components/RippleRings';
import { useFloatAnimation } from '@/hooks/useFloatAnimation';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import ShinyButton from './ShinyButton';

const GLOW_RADIUS = 120; // Matches the logo container size

const Hero = () => {
  const floatStyle = useFloatAnimation(-5, 3000);
  const buttonGradient = useSharedValue(0);

  const duration = 3000;
  const gradientAnimation = useMemo(() => {
    return withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.linear }),
        withTiming(0, { duration, easing: Easing.linear })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    buttonGradient.value = gradientAnimation;
    return () => {
      cancelAnimation(buttonGradient);
    };
  }, [gradientAnimation]);

  const shineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      buttonGradient.value,
      [0, 1],
      [-100, 200] // same as your original
    );

    return {
      transform: [{ translateX }],
    };
  });

  const GlowEffect = () => {
    return (
      <View style={styles.glowContainer}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient
              id="glow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#FFD700" stopOpacity="0.4" />
              <Stop offset="0.4" stopColor="#FFD700" stopOpacity="0.2" />
              <Stop offset="0.7" stopColor="#FFD700" stopOpacity="0.05" />
              <Stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle
            cx="120"
            cy="120"
            r={GLOW_RADIUS}
            fill="url(#glow)"
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <RippleRings />
          <GlowEffect />
          <Animated.Image
            source={require('../assets/images/logo.png')}
            style={[styles.logo, floatStyle]}
            resizeMode="contain"
          />
          <OrbitingStars />
        </View>

        {/* <Text style={styles.title}>Ask Devi</Text> */}
      </View>

      <ShinyButton
        title="Open Chat"
        onPress={() => Alert.alert('Chat opened!')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    zIndex: 10,
    marginTop: -20,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 40,
    borderRadius: 120,
    overflow: 'hidden',
  },
  glowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 120,
  },
  logo: {
    width: 220,
    height: 220,
    position: 'absolute',
    zIndex: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFD700',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
  },
  // logoContainer: {
  //   width: 220,
  //   height: 220,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 20,
  //   position: 'relative',
  // },
  // glow: {
  //   position: 'absolute',
  //   width: 180,
  //   height: 180,
  //   borderRadius: 90,
  //   backgroundColor: `${Colors.gold.DEFAULT}20`,
  //   shadowColor: Colors.gold.DEFAULT,
  //   shadowOffset: { width: 0, height: 0 },
  //   shadowOpacity: 0.8,
  //   shadowRadius: 30,
  //   transform: [{ scale: 1.2 }],
  // },
  // starOrbit: {
  //   position: 'absolute',
  //   width: ORBIT_RADIUS_2 * 2,
  //   height: ORBIT_RADIUS_2 * 2,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // star: {
  //   position: 'absolute',
  //   width: 4,
  //   height: 4,
  //   backgroundColor: Colors.gold.DEFAULT,
  //   borderRadius: 2,
  //   shadowColor: Colors.gold.DEFAULT,
  //   shadowOffset: { width: 0, height: 0 },
  //   shadowOpacity: 0.8,
  //   shadowRadius: 4,
  // },
  // logo: {
  //   width: '100%',
  //   height: '100%',
  //   zIndex: 2,
  // },
  // title: {
  //   fontFamily: 'Poppins-Bold',
  //   fontSize: 36,
  //   marginBottom: 20,
  //   color: Colors.gold.DEFAULT,
  //   textShadowColor: 'rgba(255, 215, 0, 0.5)',
  //   textShadowOffset: { width: 0, height: 0 },
  //   textShadowRadius: 10,
  // },
  buttonContainer: {
    width: 180,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.gold.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginTop: -10,
    elevation: 5,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    overflow: 'hidden',
  },
  buttonText: {
    color: Colors.deepPurple.DEFAULT,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  buttonShine: {
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

export default memo(Hero);
