import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import Dropdown from '@/components/Setup/Dropdown';
import axios from 'axios';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';

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
  "Female",
  "Other"
];

export default function ProfileScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [language, setLanguage] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');


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
      } catch (e) {
        console.log('Error loading profile data', e);
      }
    };

    loadData();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleUpdate = async () => {
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
      router.back();
    } catch (e) {
      // console.log('Error saving profile data', e);
      alert('Error saving profile data');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
        <View style={styles.container}>
          <BackgroundEffects count={30} />

          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBack}>
              <Text style={styles.backText}>{'<-'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Edit Profile</Text>
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

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update Your Data</Text>
            </TouchableOpacity>
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
    paddingTop: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
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
});
