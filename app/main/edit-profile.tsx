import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import Dropdown from '@/components/Setup/Dropdown';
import axios from 'axios';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';
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

const genders = [
  "Male",
  "Female"
];

export default function EditProfileScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [language, setLanguage] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');

  const [originalValues, setOriginalValues] = useState({
    firstName: '',
    lastName: '',
    birthPlace: '',
    language: '',
    relationshipStatus: '',
    occupation: '',
    gender: ''
  });

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        const storedBirthPlace = await AsyncStorage.getItem('birthPlace');
        let storedLanguage = await AsyncStorage.getItem('language');
        let storedRelationshipStatus = await AsyncStorage.getItem('relationshipStatus');
        let storedOccupation = await AsyncStorage.getItem('occupation');
        let storedGender = await AsyncStorage.getItem('gender');

        if (!storedLanguage || !storedRelationshipStatus || !storedOccupation || !storedGender) {
          return;
        }

        // capitalize the first letter of the storedLanguage
        storedLanguage = storedLanguage?.charAt(0).toUpperCase() + storedLanguage?.slice(1);
        storedRelationshipStatus = storedRelationshipStatus?.charAt(0).toUpperCase() + storedRelationshipStatus?.slice(1);
        storedOccupation = storedOccupation?.charAt(0).toUpperCase() + storedOccupation?.slice(1);
        storedGender = storedGender?.charAt(0).toUpperCase() + storedGender?.slice(1);

        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
        if (storedBirthPlace) setBirthPlace(storedBirthPlace);
        if (storedLanguage) setLanguage(storedLanguage);
        if (storedRelationshipStatus) setRelationshipStatus(storedRelationshipStatus);
        if (storedOccupation) setOccupation(storedOccupation);
        if (storedGender) setGender(storedGender);
        
        setOriginalValues({
          firstName: storedFirstName || '',
          lastName: storedLastName || '',
          birthPlace: storedBirthPlace || '',
          language: storedLanguage || '',
          relationshipStatus: storedRelationshipStatus || '',
          occupation: storedOccupation || '',
          gender: storedGender || ''
        });
      } catch (e) {
        console.log('Error loading profile data', e);
      }
    };

    loadData();
  }, []);

  const handleBack = () => {
    router.push('/main/home');
  };

  const handleUpdate = async () => {
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
      const userId = await getUserId();

      const response = await axios.post(`${Domain}/update-profile`, {
        userId,
        firstName,
        lastName,
        birthPlace: {
          name: birthPlace,
          latitude: 0,
          longitude: 0
        },
        preferredLanguage: language.toLowerCase(),
        relationshipStatus: relationshipStatus.toLowerCase(),
        occupation: occupation.toLowerCase(),
        gender: gender.toLowerCase()
      },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.status != 200) {
        alert('Error updating profile');
        return;
      }
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      await AsyncStorage.setItem('birthPlace', birthPlace);
      await AsyncStorage.setItem('language', language.toLowerCase());
      await AsyncStorage.setItem('relationshipStatus', relationshipStatus.toLowerCase());
      await AsyncStorage.setItem('occupation', occupation.toLowerCase());
      await AsyncStorage.setItem('gender', gender.toLowerCase());
      alert('Profile updated successfully!');
      router.push('/main/home');
    } catch (e) {
      // console.log('Error saving profile data', e);
      alert('Error saving profile data');
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

  const isFormValid = 
    firstName.trim() !== originalValues.firstName ||
    lastName.trim() !== originalValues.lastName ||
    birthPlace.trim() !== originalValues.birthPlace ||
    language !== originalValues.language ||
    relationshipStatus !== originalValues.relationshipStatus ||
    occupation !== originalValues.occupation ||
    gender !== originalValues.gender;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
        <View style={styles.container}>

          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color="#ffcc00" 
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <GradientText style={styles.header}>Edit Profile</GradientText>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.row}>
              <TextInput
                style={styles.inputHalf}
                placeholder="First Name"
                placeholderTextColor="#ccc"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.inputHalf}
                placeholder="Last Name"
                placeholderTextColor="#ccc"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <TextInput
              style={[styles.input, { color: '#ccc' }]}
              placeholder="Phone Number"
              placeholderTextColor="#ccc"
              keyboardType="phone-pad"
              value={phoneNumber}
              editable={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Birth Place"
              placeholderTextColor="#ccc"
              value={birthPlace}
              onChangeText={setBirthPlace}
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

            <Dropdown
              label="Gender"
              value={gender}
              items={genders}
              onSelect={setGender}
              placeholder="Select gender"
            />

            <Dropdown
              label="Preferred Language"
              value={language}
              items={languages}
              onSelect={setLanguage}
              placeholder="Select language"
            />

            <Animated.View
              style={[
                styles.continueButton,
                !isFormValid && styles.continueButtonDisabled,
                {
                  transform: [{ scale: scaleAnimation }],
                  shadowOpacity: glowOpacity,
                }
              ]}
            >
              <TouchableOpacity
                style={styles.continueButtonTouchable}
                onPress={handleUpdate}
                disabled={!isFormValid}
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
                    <Text style={styles.continueButtonText}>Update Your Data</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.deepPurple.DEFAULT,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.deepPurple.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 12,
    zIndex: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.gold.DEFAULT,
  },
  underline: {
    height: 3,
    width: 80,
    marginTop: 8,
    borderRadius: 1.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    backgroundColor: '#5a189a',
    borderRadius: 10,
    padding: 12,
    flex: 0.48,
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#5a189a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#ffd60a',
    padding: 14,
    borderRadius: 24,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#240046',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueButton: {
    height: 50,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 16,
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
});
