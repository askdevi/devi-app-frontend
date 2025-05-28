import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

const NUM_STARS = 24;
const ORBIT_RADIUS_1 = 100;
const ORBIT_RADIUS_2 = 120;

const Hero = () => {
  const buttonGradient = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const rotateAnim1 = useRef(new Animated.Value(0)).current;
  const rotateAnim2 = useRef(new Animated.Value(0)).current;
  const starAnims = useRef(
    Array(NUM_STARS).fill(0).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Button gradient animation
    const buttonAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGradient, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(buttonGradient, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    // Glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowOpacity, {
            toValue: 0.7,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 1.1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowOpacity, {
            toValue: 0.4,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 0.9,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Orbit rotation animations
    const orbit1Animation = Animated.loop(
      Animated.timing(rotateAnim1, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    );

    const orbit2Animation = Animated.loop(
      Animated.timing(rotateAnim2, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    // Star animations
    starAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500 + Math.random() * 1000,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 1500 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    buttonAnimation.start();
    glowAnimation.start();
    orbit1Animation.start();
    orbit2Animation.start();

    return () => {
      buttonAnimation.stop();
      glowAnimation.stop();
      orbit1Animation.stop();
      orbit2Animation.stop();
      // starAnims.forEach(anim => anim.reset());
    };
  }, []);

  const rotation1 = rotateAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const rotation2 = rotateAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg']
  });

  const renderStars = (orbitRadius: number, rotation: Animated.AnimatedInterpolation<string>) => {
    const starsPerOrbit = NUM_STARS / 2;
    return Array(starsPerOrbit).fill(0).map((_, index) => {
      const angle = (index / starsPerOrbit) * 2 * Math.PI;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * orbitRadius;
      const starAnim = starAnims[index];

      return (
        <Animated.View
          key={`${orbitRadius}-${index}`}
          style={[
            styles.star,
            {
              transform: [
                { translateX: x },
                { translateY: y },
                { scale: starAnim }
              ],
              opacity: starAnim
            }
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }]
            }
          ]}
        />

        <Animated.View style={[styles.starOrbit, { transform: [{ rotate: rotation1 }] }]}>
          {renderStars(ORBIT_RADIUS_1, rotation1)}
        </Animated.View>

        <Animated.View style={[styles.starOrbit, { transform: [{ rotate: rotation2 }] }]}>
          {renderStars(ORBIT_RADIUS_2, rotation2)}
        </Animated.View>

        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Ask Devi</Text>

      <Pressable style={styles.buttonContainer}>
        <LinearGradient
          colors={Colors.gradients.goldPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Open Chat</Text>
          <Animated.View
            style={[
              styles.buttonShine,
              {
                transform: [{
                  translateX: buttonGradient.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 200]
                  })
                }]
              }
            ]}
          />
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    zIndex: 10,
  },
  logoContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `${Colors.gold.DEFAULT}20`,
    shadowColor: Colors.gold.DEFAULT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    transform: [{ scale: 1.2 }],
  },
  starOrbit: {
    position: 'absolute',
    width: ORBIT_RADIUS_2 * 2,
    height: ORBIT_RADIUS_2 * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: Colors.gold.DEFAULT,
    borderRadius: 2,
    shadowColor: Colors.gold.DEFAULT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    marginBottom: 20,
    color: Colors.gold.DEFAULT,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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

export default Hero;