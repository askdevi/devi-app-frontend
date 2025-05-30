import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import Dropdown from '@/components/Setup/Dropdown';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getUserId } from '@/constants/userId';
import Domain from '@/constants/domain';
import 'react-native-get-random-values';

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

// const GOOGLE_PLACES_API_KEY = "AIzaSyAUogdV3s34woh5pU-JAsgrc_nLYu_sWAw";

export default function BirthPlaceScreen() {
  const router = useRouter();
  const [birthPlace, setBirthPlace] = useState('');
  const [birthPlaceCoords, setBirthPlaceCoords] = useState({ latitude: 0, longitude: 0 });
  const [language, setLanguage] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [occupation, setOccupation] = useState('');

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('birthPlace', birthPlace);
      await AsyncStorage.setItem('language', language);
      await AsyncStorage.setItem('relationshipStatus', relationshipStatus);
      await AsyncStorage.setItem('occupation', occupation);

      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      const firstName = await AsyncStorage.getItem('firstName');
      const lastName = await AsyncStorage.getItem('lastName');
      const birthDate = await AsyncStorage.getItem('birthDate');
      const birthTime = await AsyncStorage.getItem('birthTime');
      const gender = await AsyncStorage.getItem('gender');

      const userId = await getUserId();

      const birthPlaceData = {
        "latitude": birthPlaceCoords.latitude,
        "longitude": birthPlaceCoords.longitude,
        "name": birthPlace
      }

      const body = {
        userId,
        phoneNumber,
        firstName,
        lastName,
        birthDate,
        birthTime,
        gender: gender ? gender.toLowerCase() : "",
        birthPlace: birthPlaceData,
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

  const handleExit = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light]}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity
        onPress={handleExit}
        style={styles.exitButton}
      >
        <X color={Colors.gold.DEFAULT} size={24} />
      </TouchableOpacity>

      <View style={styles.content}>
        <SetupProgress currentStep={4} totalSteps={4} />

        <View style={styles.header}>
          <Text style={styles.title}>Birth Place</Text>
          <Text style={styles.subtitle}>Where were you born?</Text>
        </View>

        <View style={[styles.form, { zIndex: 2 }]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Enter your birth location"
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details) {
                  setBirthPlace(data.description);
                  setBirthPlaceCoords({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng
                  });
                }
              }}
              query={{
                key: 'AIzaSyAUogdV3s34woh5pU-JAsgrc_nLYu_sWAw',
                language: 'en',
                types: '(cities)',
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInput: {
                  backgroundColor: 'rgba(45, 17, 82, 0.3)',
                  borderWidth: 2,
                  borderColor: `${Colors.gold.DEFAULT}20`,
                  borderRadius: 12,
                  padding: 16,
                  color: Colors.white,
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                },
                listView: {
                  backgroundColor: 'rgba(45, 17, 82, 0.9)',
                  borderWidth: 2,
                  borderColor: `${Colors.gold.DEFAULT}20`,
                  borderRadius: 12,
                  marginTop: 8,
                  position: 'absolute',
                  top: 50,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                },
                row: {
                  backgroundColor: 'transparent',
                  padding: 13,
                  height: 'auto',
                  minHeight: 44,
                },
                description: {
                  color: Colors.white,
                  fontFamily: 'Poppins-Regular',
                },
                separator: {
                  height: 1,
                  backgroundColor: `${Colors.gold.DEFAULT}20`,
                },
              }}
              enablePoweredByContainer={false}
              minLength={2}
              debounce={200}
              // All defaults explicitly mentioned
              autoFillOnNotFound={false}
              currentLocation={false}
              currentLocationLabel="Current location"
              disableScroll={false}
              enableHighAccuracyLocation={false}
              filterReverseGeocodingByTypes={[]}
              GooglePlacesDetailsQuery={{}}
              GooglePlacesSearchQuery={{
                rankby: 'distance',
                type: 'restaurant',
              }}
              GoogleReverseGeocodingQuery={{}}
              isRowScrollable={true}
              keyboardShouldPersistTaps="always"
              listUnderlayColor="#c8c7cc"
              listViewDisplayed="auto"
              keepResultsAfterBlur={false}
              nearbyPlacesAPI="GooglePlacesSearch"
              numberOfLines={1}
              onFail={() => {}}
              onNotFound={() => {}}
              onTimeout={() =>
                console.warn('google places autocomplete: request timeout')
              }
              predefinedPlaces={[]}
              predefinedPlacesAlwaysVisible={false}
              suppressDefaultStyles={false}
              textInputHide={false}
              textInputProps={{}}
              timeout={20000}
            />
          </View>

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

          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <LinearGradient
              colors={[Colors.gold.DEFAULT, Colors.gold.light]}
              style={styles.completeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
              <Sparkles color={Colors.deepPurple.DEFAULT} size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.quote}>
          The cosmos whispers your truth through time and space
        </Text>

        <TouchableOpacity
          onPress={handleExit}
          style={styles.exitTextButton}
        >
          <X color={`${Colors.gold.DEFAULT}50`} size={16} />
          <Text style={styles.exitText}>Exit Setup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exitButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 17, 82, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.gold.DEFAULT}20`,
    zIndex: 10,
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
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.gold.DEFAULT,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    borderRadius: 12,
    padding: 16,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
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
    borderRadius: 25,
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
    borderRadius: 25,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 24,
  },
  completeButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.deepPurple.DEFAULT,
    marginRight: 8,
  },
  quote: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.white,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  exitTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  exitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: `${Colors.gold.DEFAULT}50`,
    marginLeft: 8,
  },
});