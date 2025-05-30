import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';

export default function GenderScreen() {
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
  const router = useRouter();

  const handleContinue = async () => {
    if (gender) {
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
        <SetupProgress currentStep={2} totalSteps={4} />

        <View style={styles.header}>
          <Text style={styles.title}>Gender</Text>
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

          <TouchableOpacity
            style={[styles.genderOption, gender === 'other' && styles.genderOptionSelected]}
            onPress={() => setGender('other')}
          >
            <Text style={[styles.genderSymbol, gender === 'other' && styles.genderSymbolSelected]}>⚥</Text>
            <Text style={[styles.genderText, gender === 'other' && styles.genderTextSelected]}>Other</Text>
          </TouchableOpacity>
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
            style={[styles.continueButton, !gender && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!gender}
          >
            <LinearGradient
              colors={Colors.gradients.goldPrimary as [string, string]}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <ArrowRight color={Colors.deepPurple.DEFAULT} size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.quote}>
          In the stars lies the map of your destiny
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
    fontSize: 32,
    color: `${Colors.gold.DEFAULT}60`,
    marginBottom: 8,
  },
  genderSymbolSelected: {
    color: Colors.gold.DEFAULT,
  },
  genderText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: `${Colors.gold.DEFAULT}60`,
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
  continueButton: {
    flex: 1,
    marginLeft: 16,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 24,
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