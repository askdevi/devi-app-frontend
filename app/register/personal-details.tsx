import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowLeft, Sparkles } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import Dropdown from '@/components/Setup/Dropdown';
import axios from 'axios';
import { getUserId } from '@/constants/userId';
import Domain from '@/constants/domain';
import 'react-native-get-random-values';
import MaskedView from '@react-native-masked-view/masked-view';

const languages = [
  "Hinglish",
  "English"
];

const relationshipStatuses = [
  "Single",
  "Dating",
  "Married",
  "Other"
];

const occupations = [
  "Employed",
  "Self-Employed",
  "Homemaker",
  "Student",
  "Other"
];

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  
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

  const handleComplete = async () => {
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
      await AsyncStorage.setItem('language', language);
      await AsyncStorage.setItem('relationshipStatus', relationshipStatus);
      await AsyncStorage.setItem('occupation', occupation);

      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      const firstName = await AsyncStorage.getItem('firstName');
      const lastName = await AsyncStorage.getItem('lastName');
      const birthDate = await AsyncStorage.getItem('birthDate');
      const birthTime = await AsyncStorage.getItem('birthTime');
      const gender = await AsyncStorage.getItem('gender');
      const birthPlaceData = await AsyncStorage.getItem('birthPlaceData');
      const birthPlace = birthPlaceData ? JSON.parse(birthPlaceData) : null;

      const userId = await getUserId();

      const body = {
        userId,
        phoneNumber,
        firstName,
        lastName,
        birthDate,
        birthTime,
        gender: gender ? gender.toLowerCase() : "",
        birthPlace: birthPlace,
        preferredLanguage: language.toLowerCase(),
        relationshipStatus: relationshipStatus.toLowerCase(),
        occupation: occupation.toLowerCase()
      }

      await axios.post(`${Domain}/register`, body);
      router.push('/main/loading' as any);
    } catch (error) {
      console.log('Error saving data:', error);
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

  const isFormComplete = language && relationshipStatus && occupation;

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SetupProgress currentStep={5} totalSteps={5} />

        <View style={styles.header}>
          <GradientText style={styles.title}>Personal Details</GradientText>
          <Text style={styles.subtitle}>Your Personal Details</Text>
        </View>

        <View style={styles.form}>
          <Dropdown
            label="Preferred Language"
            value={language}
            items={languages}
            onSelect={setLanguage}
            placeholder="Select language"
          />

          <Dropdown
            label="Relationship Status"
            value={relationshipStatus}
            items={relationshipStatuses}
            onSelect={setRelationshipStatus}
            placeholder="Select status"
          />

          <Dropdown
            label="Occupation"
            value={occupation}
            items={occupations}
            onSelect={setOccupation}
            placeholder="Select occupation"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <ArrowLeft color={Colors.gold.DEFAULT} size={20} />
            <Text style={styles.backButtonText}>Previous</Text>
          </TouchableOpacity>

          
          <Animated.View
            style={[
              styles.completeButton,
              !isFormComplete && styles.completeButtonDisabled,
              {
                transform: [{ scale: scaleAnimation }],
                shadowOpacity: glowOpacity,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.completeButtonTouchable}
              onPress={handleComplete}
              disabled={!isFormComplete}
              activeOpacity={0.8}
            >
              <View style={styles.gradientContainer}>
                <LinearGradient
                  colors={['#FFD700', '#FF8C00', '#FFD700']}
                  style={styles.completeButtonGradient}
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
                  <Text style={styles.completeButtonText}>Complete</Text>
                  <Sparkles color={Colors.deepPurple.DEFAULT} size={20} />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.quote}>
          The cosmos whispers your truth through time and space
        </Text>

      </ScrollView>
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
  form: {
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
  },
  backButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.gold.DEFAULT,
    marginLeft: 8,
  },
  completeButton: {
    flex: 1,
    marginLeft: 16,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: Colors.gold.DEFAULT,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    elevation: 8,
  },
  completeButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  completeButtonTouchable: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientContainer: {
    flex: 1,
    position: 'relative',
  },
  completeButtonGradient: {
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
  completeButtonText: {
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