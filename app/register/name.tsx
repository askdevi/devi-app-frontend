// name.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, TouchableWithoutFeedback, Keyboard, BackHandler, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import MaskedView from '@react-native-masked-view/masked-view';
import CustomInput from '@/components/CustomInput';
import * as amplitude from '@amplitude/analytics-react-native';

export default function NameScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

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

  const handleContinue = async () => {
    Keyboard.dismiss()
    if (firstName.trim() && lastName.trim()) {
      try {
        await AsyncStorage.setItem('firstName', firstName.trim());
        await AsyncStorage.setItem('lastName', lastName.trim());
        amplitude.track('Name Submitted', { screen: 'Name' });
        router.push('/register/gender');
      } catch (error: any) {
        amplitude.track('Failure: Name Submission', { screen: 'Name', message: error.message });
        console.log('Error saving name:', error);
      }
    }
  };

  const GradientText = ({ children, style }: { children: string; style?: any }) => {
    return (
      <MaskedView
        style={style}
        maskElement={
          <Text style={[style, { backgroundColor: 'transparent' }]}>
            {children}
          </Text>
        }
      >
        <LinearGradient
          colors={['#FFD700', '#FF8C00', '#FFD700']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={style}
        >
          <Text style={[style, { opacity: 0 }]}>{children}</Text>
        </LinearGradient>
      </MaskedView>
    );
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false} >
        <View style={styles.container}>
          <LinearGradient
            colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.content}>
            <SetupProgress currentStep={1} totalSteps={5} />

            {/* <View style={styles.header}> */}
            <GradientText style={styles.title}>Namaste</GradientText>
            {/* </View> */}
            <CustomInput
              value={firstName}
              onChange={setFirstName}
              label="First Name"
              errorMsg=""
              placeholder="Enter your first name"
            />
            <CustomInput
              value={lastName}
              onChange={setLastName}
              label="Last name"
              errorMsg=""
              placeholder="Enter your last name"
            />

            <View
              style={[
                styles.continueButton,
                !(firstName.trim() && lastName.trim()) && styles.continueButtonDisabled,
              ]}
            >
              <TouchableOpacity
                style={styles.continueButtonTouchable}
                onPress={handleContinue}
                disabled={!(firstName.trim() && lastName.trim())}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFD700', '#FF8C00', '#FFD700']}
                  style={styles.continueButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />

                <View style={styles.buttonContent}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <ArrowRight color={Colors.deepPurple.DEFAULT} size={20} />
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.quote}>
              The journey of self-discovery begins with a single step
            </Text>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 12,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.gold.DEFAULT,
    marginBottom: 8,
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    // backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: `${Colors.gold.DEFAULT}`,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  continueButton: {
    height: 50,
    borderRadius: 8,
    marginBottom: 24,
    marginTop: 26,
    shadowColor: Colors.gold.DEFAULT,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    elevation: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  continueButtonTouchable: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  animatedGradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 24,
    zIndex: 2,
    position: 'relative',
  },
  continueButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.deepPurple.DEFAULT,
    marginRight: 8,
    position: 'relative',
    zIndex: 10,
  },
  quote: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#d1d5dbe6',
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },

});