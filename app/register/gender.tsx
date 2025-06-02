import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import MaskedView from '@react-native-masked-view/masked-view';

export default function GenderScreen() {
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
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
    if (gender) {
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
        await AsyncStorage.setItem('gender', gender);
        router.push('/register/birth-details');
      } catch (error) {
        console.log('Error saving gender:', error);
      }
    }
  };

  const handleBack = () => {
    router.back();
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

      <View style={styles.content}>
        <SetupProgress currentStep={2} totalSteps={5} />

        <View style={styles.header}>
          <GradientText style={styles.title}>Gender</GradientText>
          <Text style={styles.subtitle}>Please select your gender</Text>
        </View>

        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderOption, gender === 'male' && styles.genderOptionSelected]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.genderSymbol, gender === 'male' && styles.genderSymbolSelected]}>♂</Text>
            <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.genderOption, gender === 'female' && styles.genderOptionSelected]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.genderSymbol, gender === 'female' && styles.genderSymbolSelected]}>♀</Text>
            <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>Female</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.previousButton}
            onPress={handleBack}
          >
            <ArrowLeft color={Colors.gold.DEFAULT} size={20} />
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.continueButton,
              !gender && styles.continueButtonDisabled,
              {
                transform: [{ scale: scaleAnimation }],
                shadowOpacity: glowOpacity,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.continueButtonTouchable}
              onPress={handleContinue}
              disabled={!gender}
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
        </View>

        <Text style={styles.quote}>
          In the stars lies the map of your destiny
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
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#d1d5dbe6',
    textAlign: 'left',
    opacity: 0.9,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  genderOption: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: `${Colors.gold.DEFAULT}20`,
    borderColor: Colors.gold.DEFAULT,
  },
  genderSymbol: {
    fontSize: 44,
    color: `${Colors.gold.DEFAULT}`,
    marginBottom: 8,
  },
  genderSymbolSelected: {
    color: Colors.gold.DEFAULT,
  },
  genderText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: `${Colors.gold.DEFAULT}`,
  },
  genderTextSelected: {
    color: Colors.gold.DEFAULT,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
  },
  previousButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.gold.DEFAULT,
    marginLeft: 8,
  },
  continueButton: {
    flex: 1,
    marginLeft: 16,
    height: 50,
    borderRadius: 8,
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