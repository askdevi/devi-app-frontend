import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Keyboard,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Domain from '@/constants/domain';
import axios from 'axios';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import RippleRings from '@/components/RippleRings';
import BackgroundEffects from '@/components/BackgroundEffects';
import OrbitingStars from '@/components/orbitingStars';
import BackgroundGradient from '@/components/BackgroundGradient';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import PhoneTextInput from '@/components/PhoneTextInput';
import { ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

const GLOW_RADIUS = 120; // Matches the logo container size


export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const glowAnimation = new Animated.Value(0);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const startGlowAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    startGlowAnimation();
  }, []);

  const GlowEffect = () => (
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

  const GradientTitle = () => {
    const glowOpacity = glowAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.39, 0.98, 0.39],
    });

    const shadowRadius = glowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 25],
    });

    return (
      <View style={styles.titleContainer}>
        <MaskedView
          maskElement={
            <Text style={styles.titleMask}>Ask Devi</Text>
          }
        >
          <LinearGradient
            colors={['#FFD700', '#FFF5CC', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.titleGradient}
          />
        </MaskedView>
        <Animated.Text
          style={[
            styles.titleGlow,
            {
              opacity: glowOpacity,
              textShadowColor: 'rgba(255, 215, 0, 0.39)',
              textShadowRadius: shadowRadius,
              textShadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          Ask Devi
        </Animated.Text>
      </View>
    );
  };

  const TermsText = () => (
    <View style={styles.termsContainer}>
      <Text style={styles.termsText}>
        By continuing, you agree to our{' '}
        <Text style={styles.termsLink}>Terms</Text>
        {' '}and{' '}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>
    </View>
  );

  const handleSubmit = async () => {
    if (loading) return;

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${Domain}/send-otp`, {
        phoneNumber: `91${phone}`
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      router.push({ pathname: '/signup/otp', params: { phone } });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <BackgroundGradient />
          <BackgroundEffects count={20} />

          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <RippleRings />
              <GlowEffect />
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <OrbitingStars />
            </View>

            <GradientTitle />
            <Text style={styles.subtitle}>Your Personal Vedic Astrologer</Text>
            <PhoneTextInput
              placeholder="Enter your phone number"
              value={phone}
              editable={true}
              // label='Phone Number'
              onChange={setPhone}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit} activeOpacity={0.8} disabled={loading}>
              <LinearGradient colors={['#FFD700', '#FFA500', '#FFD700']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
                <Text style={styles.buttonText}>{loading ? <ActivityIndicator size="small" color="#2D1152" /> : 'Send OTP'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TermsText />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepPurple.DEFAULT,
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  content: {
    alignItems: 'center'
  },
  logoContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -10,
    borderRadius: 120,
    overflow: 'hidden',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 120,
  },
  logo: {
    width: 220,
    height: 220,
    position: 'absolute',
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
    position: 'relative',
  },
  titleMask: {
    fontSize: 36,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    letterSpacing: 0.025 * 36,
  },
  titleGradient: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
  },
  titleGlow: {
    position: 'absolute',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: 'transparent',
    zIndex: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFD700CC',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  errorText: { color: 'red', marginBottom: 8, textAlign: 'center' },
  buttonContainer: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1152',
  },
  termsContainer: { paddingHorizontal: 16, marginTop: 8 },
  termsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontSize: 12,
  },
  termsLink: { color: '#FFD700', textDecorationLine: 'underline' },
});
