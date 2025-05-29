import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import WheelPicker from '@/components/Setup/WheelPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BirthDetailsScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const [selectedTime, setSelectedTime] = useState({
    hour: '12',
    minute: '00',
    period: 'AM'
  });

  const [knowsBirthTime, setKnowsBirthTime] = useState<boolean | null>(false);

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const years = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const handleContinue = async () => {
    try {
      const birthDate = `${selectedDate.year}-${selectedDate.month < 10 ? '0' + selectedDate.month : selectedDate.month}-${selectedDate.day < 10 ? '0' + selectedDate.day : selectedDate.day}`;
      const birthTime = knowsBirthTime ? `${selectedTime.period === 'AM' ? selectedTime.hour : Number(selectedTime.hour) + 12}:${selectedTime.minute}` : null;
      await AsyncStorage.setItem('birthDate', birthDate);
      await AsyncStorage.setItem('birthTime', birthTime ? birthTime : '00:00');
      router.push('/(auth)/setup/birth-place');
    } catch (error) {
      console.error('Error saving birth details:', error);
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SetupProgress currentStep={3} totalSteps={4} />

        <View style={styles.header}>
          <Text style={styles.title}>Birth Details</Text>
          <Text style={styles.subtitle}>When were you born?</Text>
        </View>

        <View style={styles.datePickerContainer}>
          <WheelPicker
            items={days}
            value={String(selectedDate.day)}
            onChange={(value) => setSelectedDate(prev => ({ ...prev, day: Number(value) }))}
            label="Day"
          />
          <WheelPicker
            items={months}
            value={String(selectedDate.month)}
            onChange={(value) => setSelectedDate(prev => ({ ...prev, month: Number(value) }))}
            label="Month"
          />
          <WheelPicker
            items={years}
            value={String(selectedDate.year)}
            onChange={(value) => setSelectedDate(prev => ({ ...prev, year: Number(value) }))}
            label="Year"
          />
        </View>

        <Text style={styles.timeQuestion}>Do you know your time of birth?</Text>

        <View style={styles.timeOptionsContainer}>
          <TouchableOpacity
            style={[styles.timeOption, knowsBirthTime === true && styles.timeOptionSelected]}
            onPress={() => setKnowsBirthTime(true)}
          >
            <Text style={[styles.timeOptionText, knowsBirthTime === true && styles.timeOptionTextSelected]}>
              Yes, I know
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timeOption, knowsBirthTime === false && styles.timeOptionSelected]}
            onPress={() => setKnowsBirthTime(false)}
          >
            <Text style={[styles.timeOptionText, knowsBirthTime === false && styles.timeOptionTextSelected]}>
              I don't know
            </Text>
          </TouchableOpacity>
        </View>

        {knowsBirthTime && (
          <View style={styles.timePickerContainer}>
            <WheelPicker
              items={hours}
              value={selectedTime.hour}
              onChange={(value) => setSelectedTime(prev => ({ ...prev, hour: value }))}
              label="Hour"
            />
            <WheelPicker
              items={minutes}
              value={selectedTime.minute}
              onChange={(value) => setSelectedTime(prev => ({ ...prev, minute: value }))}
              label="Minute"
            />
            <WheelPicker
              items={periods}
              value={selectedTime.period}
              onChange={(value) => setSelectedTime(prev => ({ ...prev, period: value }))}
              label="AM/PM"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <ArrowLeft color={Colors.gold.DEFAULT} size={20} />
            <Text style={styles.backButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
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
          Your birth chart is the canvas of your soul's journey
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
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  timeQuestion: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  timeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
  },
  timeOptionSelected: {
    backgroundColor: `${Colors.gold.DEFAULT}20`,
    borderColor: Colors.gold.DEFAULT,
  },
  timeOptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: `${Colors.gold.DEFAULT}60`,
    textAlign: 'center',
  },
  timeOptionTextSelected: {
    color: Colors.gold.DEFAULT,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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