import React, { memo, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Colors from '@/constants/Colors';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import OrbitingStars from '@/components/orbitingStars';
import RippleRings from '@/components/RippleRings';
import { useFloatAnimation } from '@/hooks/useFloatAnimation';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import ShinyButton from './ShinyButton';
import { router } from 'expo-router';
import * as amplitude from '@amplitude/analytics-react-native';

const GLOW_RADIUS = 160; // Increased from 120 for a larger glow

const Hero = () => {
  const floatStyle = useFloatAnimation(-5, 3000);
  const buttonGradient = useSharedValue(0);
  const glowOpacity = useSharedValue(1);

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

    // Start glow blinking animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(buttonGradient);
      cancelAnimation(glowOpacity);
    };
  }, [gradientAnimation]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const GlowEffect = () => {
    return (
      <Animated.View style={[styles.glowContainer, glowStyle]}>
        <Svg height="200%" width="200%" style={[StyleSheet.absoluteFill, { top: '-50%', left: '-50%' }]}>
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
              <Stop offset="0" stopColor="#FFA500" stopOpacity="0.9" />
              <Stop offset="0.1" stopColor="#FFA500" stopOpacity="0.6" />
              <Stop offset="0.3" stopColor="#FFA500" stopOpacity="0.2" />
              <Stop offset="0.5" stopColor="#FFA500" stopOpacity="0.05" />
              <Stop offset="0.7" stopColor="#FFA500" stopOpacity="0.005" />
              <Stop offset="0.9" stopColor="#FFA500" stopOpacity="0.001" />
              <Stop offset="0.95" stopColor="#FFA500" stopOpacity="0.00005" />
              <Stop offset="0.98" stopColor="#FFA500" stopOpacity="0.000001" />
              <Stop offset="1" stopColor="#FFA500" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle
            cx="50%"
            cy="50%"
            r={GLOW_RADIUS}
            fill="url(#glow)"
          />
        </Svg>
      </Animated.View>
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
        onPress={() => {
          amplitude.track('Clicked Open Chat Button', { screen: 'Home' });
          router.push('/main/devi');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    zIndex: 10,
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
    borderRadius: 120,
    overflow: 'visible',
  },
  glowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'visible',
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
