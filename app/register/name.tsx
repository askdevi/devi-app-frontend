import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import MaskedView from '@react-native-masked-view/masked-view';

export default function NameScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  const gradientAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const gradientLoop = Animated.loop(
      Animated.timing(gradientAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    );
    gradientLoop.start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glowLoop.start();

    return () => {
      gradientLoop.stop();
      glowLoop.stop();
    };
  }, []);

  const handleContinue = async () => {
    if (firstName.trim() && lastName.trim()) {
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();

      try {
        await AsyncStorage.setItem('firstName', firstName.trim());
        await AsyncStorage.setItem('lastName', lastName.trim());
        router.push('/register/gender');
      } catch (error) {
        console.log('Error saving name:', error);
      }
    }
  };

  const gradientTranslateX = gradientAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

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
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light]}
        style={StyleSheet.absoluteFill}
      />

      {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <View style={styles.backArrowContainer}>
          <Ionicons
            name="arrow-back"
            size={20}
            color="#FFD700"
          />
        </View>
      </TouchableOpacity> */}

      <View style={styles.content}>
        <SetupProgress currentStep={1} totalSteps={5} />

        {/* <View style={styles.header}> */}
        <GradientText style={styles.title}>Namaste</GradientText>
        {/* </View> */}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            placeholderTextColor={`${Colors.gold.DEFAULT}40`}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor={`${Colors.gold.DEFAULT}40`}
          />
        </View>

        <Animated.View
          style={[
            styles.continueButton,
            !(firstName.trim() && lastName.trim()) && styles.continueButtonDisabled,
            {
              transform: [{ scale: scaleAnimation }],
              shadowOpacity: glowOpacity,
            }
          ]}
        >
          <TouchableOpacity
            style={styles.continueButtonTouchable}
            onPress={handleContinue}
            disabled={!(firstName.trim() && lastName.trim())}
            activeOpacity={0.8}
          >
            <View style={styles.gradientContainer}>
              <LinearGradient
                colors={['#FFD700', '#FF8C00', '#FFD700']}
                style={styles.continueButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />

              <Animated.View
                style={[
                  styles.animatedGradientOverlay,
                  {
                    transform: [{ translateX: gradientTranslateX }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                  style={styles.shimmerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>

              <View style={styles.buttonContent}>
                <Text style={styles.continueButtonText}>Continue</Text>
                <ArrowRight color={Colors.deepPurple.DEFAULT} size={20} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.quote}>
          The journey of self-discovery begins with a single step
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
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
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.gold.DEFAULT,
    marginBottom: 4,
    // textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#d1d5dbe6',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    borderRadius: 12,
    padding: 16,
    color: `${Colors.gold.DEFAULT}50`,
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
  gradientContainer: {
    flex: 1,
    position: 'relative',
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
  shimmerGradient: {
    flex: 1,
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