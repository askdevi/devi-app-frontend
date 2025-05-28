import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Domain from '@/constants/domain';
import axios from 'axios';


export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const router = useRouter();

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
      console.log(response);
      // router.push({ pathname: '/otp', params: { phone } });
    } catch (err) {
      console.log(err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.purplePrimary}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Ask Devi</Text>
        <Text style={styles.subtitle}>Enter your phone number to continue</Text>

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
            onChangeText={setPhone}
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
            colors={Colors.gradients.goldPrimary}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.gold.DEFAULT,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.9,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
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
  },
});