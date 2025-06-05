import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, TouchableNativeFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import Domain from '@/constants/domain';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import BackgroundGradient from '@/components/BackgroundGradient';
import BackgroundEffects from '@/components/BackgroundEffects';
import { SafeAreaView } from 'react-native-safe-area-context';

export async function storeUserId(userId: string) {
  await SecureStore.setItemAsync('userId', userId);
}

export default function OtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const glowAnimation = new Animated.Value(0);

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

  const GradientTitle = () => {
    const glowOpacity = glowAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.39, 0.98, 0.39],
    });

    const shadowRadius1 = glowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 18],
    });

    const shadowRadius2 = glowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [25, 35],
    });

    return (
      <View style={styles.titleContainer}>
        <MaskedView
          maskElement={
            <Text style={styles.titleMask}>Enter OTP</Text>
          }
        >
          <LinearGradient
            colors={['#FFD700', '#FFF5CC', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.titleGradient}
          />
        </MaskedView>

        {/* Glow Effect Layers */}
        <Animated.Text
          style={[
            styles.titleGlow,
            {
              opacity: glowOpacity,
              textShadowColor: 'rgba(255, 215, 0, 0.39)',
              textShadowRadius: shadowRadius1,
              textShadowOffset: { width: 0, height: 0 },
            }
          ]}
        >
          Enter OTP
        </Animated.Text>
        <Animated.Text
          style={[
            styles.titleGlow,
            {
              opacity: glowOpacity,
              textShadowColor: 'rgba(255, 215, 0, 0.29)',
              textShadowRadius: shadowRadius2,
              textShadowOffset: { width: 0, height: 0 },
            }
          ]}
        >
          Enter OTP
        </Animated.Text>
      </View>
    );
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };
  useEffect(()=>{
      const allDigitsFilled = otp.every(digit => digit !== '');
    if (otp && allDigitsFilled) {
      handleSubmit()
      }
  },[otp])
  const handleSubmit = async () => {
    const otpString = otp.join('');
    const allDigitsFilled = otp.every(digit => digit !== '');
    if (!otp || !allDigitsFilled) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${Domain}/verify-otp`, {
        params: {
          otp: otpString,
          phoneNumber: `91${phone}`
        },
        headers: {
          'authKey': '447014AJpvMqm3pOU67ff3779P1'
        }
      });
      await AsyncStorage.setItem('phoneNumber', `+91${phone}`);
      await storeUserId(response.data.userId);
      if (response.data.exists) {
        router.push('/main/loading');
      } else {
        router.push('/register/name');
      }
      // console.log(response.data);
    } catch (err) {
      console.log(err);
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      console.log('Resending code to:', phone);
      setError('Code resent successfully!');
    } catch (err) {
      console.log(err);
      setError('Failed to resend code. Please try again.');
    }
  };

  return (
    <>
      <BackgroundGradient />
      <BackgroundEffects count={20} />
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableNativeFeedback  onPress={()=>Keyboard.dismiss()} accessible={false}>
          <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color="#ffcc00" 
                />
            </TouchableOpacity>

            <View style={styles.content}>
              <GradientTitle />
              <Text style={styles.subtitle}>
                {"A verification code has been sent to\n"}
                <Text style={styles.phoneNumber}>+91 {phone}</Text>
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpInputFilled : null,
                      focusedIndex === index ? styles.otpInputFocused : null
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    onFocus={() => handleFocus(index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoFocus={index === 0}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500', '#FFD700']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Verifying...' : 'Verify'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleResendCode} style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  Didn't receive code? <Text style={styles.resendLink}>Resend</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableNativeFeedback>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 10,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: -2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 140,
    alignItems: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    width: '100%',
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
    minWidth: 280,
  },
  titleGlow: {
    position: 'absolute',
    top: 0,
    fontSize: 36,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'left',
    includeFontPadding: false,
    letterSpacing: 0.025 * 36,
    color: 'transparent',
    zIndex: -1,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'rgba(156, 163, 175, 1)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    width: '100%',
  },
  phoneNumber: {
    color: '#FFD700',
    fontFamily: 'Poppins-Medium',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  otpInput: {
    width: 48,
    height: 48,
    // backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  otpInputFilled: {
    backgroundColor: 'rgba(45, 17, 82, 0.4)',
  },
  otpInputFocused: {
    borderColor: 'rgba(255, 215, 0, 0.4)',
    backgroundColor: 'rgba(45, 17, 82, 0.4)',
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf:"center",
    width: '90%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.deepPurple.DEFAULT,
  },
  resendContainer: {
    alignItems: 'center',
    width: '100%',
  },
  resendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(156, 163, 175, 1)',
    textAlign: 'center',
  },
  resendLink: {
    color: '#FFD700',
    fontFamily: 'Poppins-Medium',
  },
});