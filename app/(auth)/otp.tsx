import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Replace with your actual OTP verification API endpoint
      // const response = await axios.post(`${Domain}/verify-otp`, {
      //   otp: otp,
      //   phoneNumber: `91${router.params?.phone}`
      // });
      console.log('Verifying OTP:', otp);
      // On successful verification, navigate to the next screen
      // router.push('/home');
    } catch (err) {
      console.log(err);
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // Replace with your resend OTP API endpoint
      // await axios.post(`${Domain}/resend-otp`, {
      //   phoneNumber: `91${router.params?.phone}`
      // });
      console.log('Resending code to:', router.params?.phone);
      setError('Code resent successfully!');
    } catch (err) {
      console.log(err);
      setError('Failed to resend code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.purplePrimary}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>We sent a 4-digit code to +91{router.params?.phone}</Text>

        <View style={styles.otpContainer}>
          <TextInput
            style={styles.otpInput}
            placeholder="••••"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={4}
            autoFocus
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
            colors={Colors.gradients.goldPrimary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendText}>
            Didn't receive code? <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.gold.DEFAULT,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
  },
  otpContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  otpInput: {
    width: '50%',
    backgroundColor: 'rgba(45, 17, 82, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    textAlign: 'center',
    letterSpacing: 8,
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
    marginBottom: 16,
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
  resendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 8,
  },
  resendLink: {
    color: Colors.gold.DEFAULT,
    fontFamily: 'Poppins-SemiBold',
  },
});