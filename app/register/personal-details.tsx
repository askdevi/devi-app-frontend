import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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
import CustomDropdown from '@/components/CustomDropdown';

const languageData = [
  { label: 'Hinglish', value: 'Hinglish' },
  { label: 'English', value: 'English' },
];
const relationshipStatusData = [
  { label: 'Single', value: 'Single' },
  { label: 'Dating', value: 'Dating' },
  { label: 'Married', value: 'Married' },
  { label: 'Other', value: 'Other' },
];

const occupationsData = [
  { label: 'Employed', value: 'Employed' },
  { label: 'Self-Employed', value: 'Self-Employed' },
  { label: 'Homemaker', value: 'Homemaker' },
  { label: 'Student', value: 'Student' },
  { label: 'Other', value: 'Other' },
];
export default function PersonalDetailsScreen() {
  
  const router = useRouter();
  const [language, setLanguage] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [loading, setLoading] = useState(false);


  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('language', language);
      await AsyncStorage.setItem('relationshipStatus', relationshipStatus);
      await AsyncStorage.setItem('occupation', occupation);
      await AsyncStorage.setItem('startedFreeMinutes', '0');

      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      const firstName = await AsyncStorage.getItem('firstName');
      const lastName = await AsyncStorage.getItem('lastName');
      const birthDate = await AsyncStorage.getItem('birthDate');
      const birthTime = await AsyncStorage.getItem('birthTime');
      const gender = await AsyncStorage.getItem('gender');
      const birthPlaceData = await AsyncStorage.getItem('birthPlaceData');

      const birthPlace = birthPlaceData ? JSON.parse(birthPlaceData) : null;
      const userId = await getUserId();

      // Push to loading immediately after saving local data
      router.push('/main/loading' as any);

      // Start the registration API call asynchronously (without await)
      // This WILL execute after router.push since router.push is non-blocking
      const registerUser = async () => {
        try {
          console.log('Starting background registration...');
          await AsyncStorage.setItem('registrationComplete', 'false');
          const body = {
            userId,
            phoneNumber,
            firstName,
            lastName,
            birthDate,
            birthTime,
            gender: gender ? gender.toLowerCase() : '',
            birthPlace: birthPlace,
            preferredLanguage: language.toLowerCase(),
            relationshipStatus: relationshipStatus.toLowerCase(),
            occupation: occupation.toLowerCase(),
          };
          await axios.post(`${Domain}/register`, body);
          console.log('Registration completed successfully');
          // Mark registration as complete
          await AsyncStorage.setItem('registrationComplete', 'true');
        } catch (error: any) {
          console.log('PersonalDetailsScreen: Error in registration:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
          });
          // Mark registration as failed so loading page can handle it
          await AsyncStorage.setItem('registrationComplete', 'false');
        }
      };

      // Execute registration in background - this runs after router.push
      registerUser();
      
    } catch (error: any) {
      console.log('PersonalDetailsScreen: Error in handleComplete:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isFormComplete = language && relationshipStatus && occupation;



  const GradientText = ({
    children,
    style,
  }: {
    children: string;
    style?: any;
  }) => {
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
        colors={[
          Colors.deepPurple.dark,
          Colors.deepPurple.DEFAULT,
          Colors.deepPurple.light,
        ]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SetupProgress currentStep={5} totalSteps={5} />

        <View style={styles.header}>
          <GradientText style={styles.title}>Personal Details</GradientText>
          {/* <Text style={styles.subtitle}>Your Personal Details</Text> */}
        </View>

        <View style={styles.form}>
          <CustomDropdown
            renderData={languageData}
            labelName="Preferred Language"
            placeholder="Select Language"
            // required
            selected={language}
            setSelected={setLanguage}
            search={false}
          />
          <CustomDropdown
            renderData={relationshipStatusData}
            labelName="Relationship Status"
            placeholder="Select Status"
            // required
            selected={relationshipStatus}
            setSelected={setRelationshipStatus}
            search={false}
          />
          <CustomDropdown
            renderData={occupationsData}
            labelName="Occupation"
            placeholder="Select Occupation"
            // required
            selected={occupation}
            setSelected={setOccupation}
            search={false}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.previousButton}
            onPress={handleBack}
          >
            <ArrowLeft color={Colors.gold.DEFAULT} size={20} />
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueButton, !isFormComplete && styles.continueButtonDisabled]}
            onPress={handleComplete}
            disabled={!isFormComplete}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={Colors.gradients.goldPrimary}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueButtonText}>Complete</Text>
              <Sparkles color={Colors.deepPurple.DEFAULT} size={20} />
            </LinearGradient>
          </TouchableOpacity>
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
    paddingTop: 80,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.gold.DEFAULT,
    marginBottom: 4,
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
    gap: 16,
    marginBottom: 24,
  },
  previousButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
  },
  previousButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.gold.DEFAULT,
    marginLeft: 8,
  },
  continueButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  continueButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.deepPurple.DEFAULT,
    marginRight: 8,
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
