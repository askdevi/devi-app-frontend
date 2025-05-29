import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const languages = [
  "Hindi",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Urdu",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Sanskrit"
];

const relationshipStatuses = [
  "Single",
  "In a Relationship",
  "Married",
  "Divorced",
  "Widowed"
];

const GOOGLE_PLACES_API_KEY = "AIzaSyAUogdV3s34woh5pU-JAsgrc_nLYu_sWAw";

export default function BirthPlaceScreen() {
  const router = useRouter();
  const [birthPlace, setBirthPlace] = useState('');
  const [language, setLanguage] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [occupation, setOccupation] = useState('');

  const handleComplete = () => {
    router.replace('/');
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

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SetupProgress currentStep={4} totalSteps={4} />

        <View style={styles.header}>
          <Text style={styles.title}>Birth Place</Text>
          <Text style={styles.subtitle}>Where were you born?</Text>
        </View>

        <View style={[styles.form, { zIndex: 2 }]}>
          <View style={[styles.inputGroup, { zIndex: 1 }]}>
            {/* <GooglePlacesAutocomplete
              placeholder="Enter city, state"
              onPress={(data, details = null) => {
                console.log(data, details);
                setBirthPlace(data.description);
              }}
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: 'en',
                types: '(cities)'
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInput: {
                  ...styles.input,
                  color: Colors.white,
                },
                listView: {
                  backgroundColor: 'rgba(45, 17, 82, 0.95)',
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: `${Colors.gold.DEFAULT}20`,
                  position: 'absolute',
                  top: 55,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                },
                row: {
                  backgroundColor: 'transparent',
                  padding: 13,
                },
                description: {
                  color: Colors.white,
                },
              }}
              enablePoweredByContainer={false}
              fetchDetails={true}
              keyboardShouldPersistTaps="handled"
            /> */}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Language</Text>
            <View style={styles.select}>
              <TextInput
                style={styles.input}
                value={language}
                onChangeText={setLanguage}
                placeholder="Select language"
                placeholderTextColor={`${Colors.gold.DEFAULT}40`}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Relationship Status</Text>
            <View style={styles.select}>
              <TextInput
                style={styles.input}
                value={relationshipStatus}
                onChangeText={setRelationshipStatus}
                placeholder="Select status"
                placeholderTextColor={`${Colors.gold.DEFAULT}40`}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Occupation</Text>
            <TextInput
              style={styles.input}
              value={occupation}
              onChangeText={setOccupation}
              placeholder="Enter your occupation"
              placeholderTextColor={`${Colors.gold.DEFAULT}40`}
            />
          </View>
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
      </ScrollView>
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
  select: {
    position: 'relative',
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