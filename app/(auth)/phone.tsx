import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Image, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Domain from '@/constants/domain';
import axios from 'axios';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import RippleRings from '@/components/RippleRings';
import BackgroundEffects from '@/components/BackgroundEffects';
import OrbitingStars from '@/components/orbitingStars';
import BackgroundGradient from '@/components/BackgroundGradient';
import { LinearGradient } from 'expo-linear-gradient';

const GLOW_RADIUS = 120; // Matches the logo container size


export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async () => {
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
      // console.log(response);
      router.push({ pathname: '/otp', params: { phone } });
    } catch (err) {
      console.log(err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundGradient />

      <BackgroundEffects count={30} />

      <View style={styles.contentContainer}>
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

          <Text style={styles.title}>Ask Devi</Text>
          <Text style={styles.subtitle}>Your Personal Vedic Astrologer</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.phonePrefix}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (text.length === 10) {
                Keyboard.dismiss();
              }
            }}
            maxLength={10}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FFD700', '#FDB137']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
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

  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
    marginTop: -100,
  },
  phonePrefix: {
    backgroundColor: 'rgba(45, 17, 82, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRightWidth: 0,
    justifyContent: 'center',
  },
  prefixText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(45, 17, 82, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderLeftWidth: 0,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.deepPurple.DEFAULT,
  },
  termsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: '80%',
    marginTop: 16,
    marginBottom: 150,
  },
});