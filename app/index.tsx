import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, Pressable, Dimensions, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';

const GLOW_RADIUS = 140; // Adjusted to match container size
const FLOWER_COUNT = 12;

function FlowerRing() {
  const flowers = Array.from({ length: FLOWER_COUNT }, (_, i) => {
    const angle = (i / FLOWER_COUNT) * 2 * Math.PI;
    const delay = i * (6000 / FLOWER_COUNT);
    return { angle, delay };
  });

  return (
    <View style={styles.flowerContainer}>
      {flowers.map((flower, index) => (
        <AnimatedFlower
          key={index}
          angle={flower.angle}
          delay={flower.delay}
        />
      ))}
    </View>
  );
}

function AnimatedFlower({ angle, delay }: { angle: number; delay: number }) {
  const glow = useSharedValue(0);
  const radius = 120;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  useEffect(() => {
    glow.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x }, { translateY: y }],
    opacity: glow.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.flower,
        animatedStyle,
      ]}
    >
      ꕥ
    </Animated.Text>
  );
}

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
          cx="140"
          cy="140"
          r={GLOW_RADIUS}
          fill="url(#glow)"
        />
      </Svg>
    </View>
  );
};

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      const userId = await getUserId();
      try {
        if (!userId) {
          router.replace('/signup/phone');
          return;
        }

        // Check if registration is in progress from personal-details page
        const waitForRegistration = async () => {
          let registrationComplete = await AsyncStorage.getItem('registrationComplete');

          // If registrationComplete is null, it means we're not coming from registration flow
          if (registrationComplete === null) {
            return true; // Proceed normally
          }

          // Wait for registration to complete (with timeout)
          let attempts = 0;
          const maxAttempts = 30; // 15 seconds max wait time

          while (registrationComplete !== 'true' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
            registrationComplete = await AsyncStorage.getItem('registrationComplete');
            attempts++;
          }

          // Clear the registration status flag
          await AsyncStorage.removeItem('registrationComplete');

          // Return true if registration succeeded, false if failed or timed out
          return registrationComplete === 'true';
        };

        // Wait for registration if needed
        const registrationSuccess = await waitForRegistration();

        if (!registrationSuccess) {
          // Registration failed or timed out, redirect to registration
          router.replace('/register/name');
          return;
        }

        const response2 = await axios.get(`${Domain}/get-profile`, {
          params: {
            userId: userId
          }
        });

        const response = await axios.get(`${Domain}/daily-blessings`, {
          params: {
            userId: userId
          }
        });

        const response3 = await axios.get(`${Domain}/latest-chat-history`, {
          params: {
            userId: userId
          }
        });

        if (response.data && response2.data && response3.data) {
          const dailyBlessings = response.data;
          await AsyncStorage.setItem('timeEnd', response2.data.user.timeEnd);

          await AsyncStorage.setItem('firstName', response2.data.user.firstName);
          await AsyncStorage.setItem('lastName', response2.data.user.lastName);

          await AsyncStorage.setItem('birthDate', response2.data.user.birthDate);
          await AsyncStorage.setItem('birthTime', response2.data.user.birthTime);
          await AsyncStorage.setItem('birthPlaceData', JSON.stringify(response2.data.user.birthPlace));
          await AsyncStorage.setItem('language', response2.data.user.preferredLanguage);
          await AsyncStorage.setItem('relationshipStatus', response2.data.user.relationshipStatus);
          await AsyncStorage.setItem('occupation', response2.data.user.occupation);
          await AsyncStorage.setItem('gender', response2.data.user.gender);

          await AsyncStorage.setItem('latestChatHistory', JSON.stringify(response3.data));

          await AsyncStorage.setItem('dailyBlessings', JSON.stringify(dailyBlessings));
          await AsyncStorage.setItem('popupShown', 'false');

          const sign1 = await AsyncStorage.getItem('profilePic');

          if (!sign1 && response2.data.user.sign) {
            await AsyncStorage.setItem('profilePic', response2.data.user.sign + " " + response2.data.user.gender);
          }

          router.replace('/main/home');
        } else {
          router.replace('/signup/phone');
        }
      } catch (error) {
        console.log('LoadingScreen: Error initializing app:', error);
        if (!userId) {
          console.log('LoadingScreen: No userId after error, redirecting to /signup/phone');
          router.replace('/signup/phone');
        } else {
          console.log('LoadingScreen: UserId exists after error, redirecting to /register/name');
          router.replace('/register/name');
        }
      }
    };

    initializeApp();
  }, []);

  return (
    <Pressable style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0a0219', '#1a0632', '#0a0219']}
        style={styles.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.namaste}>Namaste</Text>
          <Text style={styles.loadingText}>Loading Your Personal Vedic Astrologer</Text>
        </View>

        <View style={styles.imageContainer}>
          <GlowEffect />
          <FlowerRing />
          <Image
            source={require('@/assets/images/welcome.png')}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.quote}>
          The universe speaks in the language of stars
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  namaste: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFD700',
    opacity: 0.8,
    textAlign: 'center',
  },
  imageContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 140,
    overflow: 'hidden',
  },
  glowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 140,
  },
  welcomeImage: {
    width: 200,
    height: 200,
    position: 'relative',
    zIndex: 10,
  },
  flowerContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flower: {
    position: 'absolute',
    fontSize: 24,
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  quote: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});