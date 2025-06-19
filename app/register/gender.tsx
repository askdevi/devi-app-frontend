import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import MaskedView from '@react-native-masked-view/masked-view';
import * as amplitude from '@amplitude/analytics-react-native';

export default function GenderScreen() {
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const router = useRouter();


  const handleContinue = async () => {
    if (gender) {
      try {
        await AsyncStorage.setItem('gender', gender);
        amplitude.track('Gender Submitted', { screen: 'Gender' });
        router.push('/register/birth-details');
      } catch (error: any) {
        amplitude.track('Failure: Gender Submission', { screen: 'Gender', message: error.message });
        console.log('Error saving gender:', error);
      }
    }
  };

  const handleBack = () => {
    router.back();
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
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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

          <TouchableOpacity
            style={[styles.continueButton, !gender && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!gender}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={Colors.gradients.goldPrimary}
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
    gap: 16,
    marginHorizontal: 8,
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