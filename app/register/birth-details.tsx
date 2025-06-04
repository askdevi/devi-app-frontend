import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskedView from '@react-native-masked-view/masked-view';
import CompactInput from '@/components/CompactInput';

export default function BirthDetailsScreen() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [knowsBirthTime, setKnowsBirthTime] = useState<boolean | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [birthTimePeriod, setBirthTimePeriod] = useState<string>('AM');

  // Refs for inputs
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const hourRef = useRef<TextInput>(null);
  const minuteRef = useRef<TextInput>(null);

  const validateDay = (text: string) => {
    let val = text;
    if (parseInt(val) > 31) val = '';
    setDay(val);
    if (val.length >= 2) {
      monthRef.current?.focus();
    }
  };

  const validateMonth = (text: string) => {
    let val = text;
    if (parseInt(val) > 12) val = '';
    setMonth(val);
    if (val.length >= 2) {
      yearRef.current?.focus();
    }
  };

  const validateYear = async(text: string) => {
    let val = text;
    if (parseInt(val) > currentYear) val = await currentYear.toString();
    const final = val.toString();
    console.log("final year",final)
    setYear(final);
  };

  const validateHour = (text: string) => {
    let val = text;
    if (parseInt(val) > 12) val = '';
    const final = val.toString();
    setHour(final);
    if (final.length >= 2) {
      minuteRef.current?.focus();
    }
  };

  const validateMinute = (text: string) => {
    let val = text;
    if (parseInt(val) > 59) val = '';
    setMinute(val);
  };

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
      const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
      const birthTime = knowsBirthTime
        ? `${
            birthTimePeriod === 'AM'
              ? hour
              : String(Number(hour) + 12).padStart(2, '0')
          }:${minute}`
        : null;
      await AsyncStorage.setItem('birthDate', birthDate);
      await AsyncStorage.setItem('birthTime', birthTime ? birthTime : '00:00');
      router.push('/register/birth-place');
    } catch (error) {
      console.log('Error saving birth details:', error);
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
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <LinearGradient
        colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <SetupProgress currentStep={3} totalSteps={5} />

        <View style={styles.header}>
          <GradientText style={styles.title}>Birth Details</GradientText>
          <Text style={styles.subtitle}>When were you born?</Text>
        </View>

        <View style={styles.datePickerContainer}>
          <CompactInput
            value={day}
            onChange={validateDay}
            placeholder="DD"
            keyboardType="number-pad"
            maxLength={2}
            returnKeyType="next"
            width={60}
          />

          <View style={styles.slashBox}>
            <Text style={styles.inputSlash}>/</Text>
          </View>
          <CompactInput
            ref={monthRef}
            value={month}
            onChange={validateMonth}
            placeholder="MM"
            keyboardType="number-pad"
            maxLength={2}
            width={60}
            returnKeyType="next"
          />
          <View style={styles.slashBox}>
            <Text style={styles.inputSlash}>/</Text>
          </View>
          <CompactInput
            ref={yearRef}
            value={year}
            onChange={validateYear}
            placeholder="YYYY"
            keyboardType="number-pad"
            maxLength={4}
            width={70}
            returnKeyType="done"
          />
        </View>

        <Text style={styles.timeQuestion}>Do you know your time of birth?</Text>

        <View style={styles.timeOptionsContainer}>
          <TouchableOpacity
            style={[styles.timeOption, knowsBirthTime === true && styles.timeOptionSelected]}
            onPress={() => setKnowsBirthTime(true)}
          >
            <Text
              style={[
                styles.timeOptionText,
                knowsBirthTime === true && styles.timeOptionTextSelected,
              ]}
            >
              Yes, I know
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.timeOption,
              knowsBirthTime === false && styles.timeOptionSelected,
            ]}
            onPress={() => setKnowsBirthTime(false)}
          >
            <Text
              style={[
                styles.timeOptionText,
                knowsBirthTime === false && styles.timeOptionTextSelected,
              ]}
            >
              I don't know
            </Text>
          </TouchableOpacity>
        </View>

        {knowsBirthTime && (
          <View style={styles.datePickerContainer}>
            <CompactInput
              ref={hourRef}
              value={hour}
              onChange={validateHour}
              placeholder="HH"
              keyboardType="number-pad"
              maxLength={2}
              width={60}
              returnKeyType="next"
            />
            <View style={styles.slashBox}>
              <Text style={styles.inputSlash}>:</Text>
            </View>
            <CompactInput
              ref={minuteRef}
              value={minute}
              onChange={validateMinute}
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              returnKeyType="done"
              width={60}
            />

            <View style={styles.slashBox}>
              <Text style={styles.inputSlash}>{''}</Text>
            </View>
            <View style={styles.amPmContainer}>
              <TouchableOpacity
                style={[
                  birthTimePeriod === 'AM' ? styles.ampmSelected : styles.ampm,
                  { marginRight: 5 },
                ]}
                onPress={() => setBirthTimePeriod('AM')}
              >
                <Text
                  style={[
                    birthTimePeriod === 'AM'
                      ? styles.ampmTextSelected
                      : styles.ampmText,
                  ]}
                >
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  birthTimePeriod === 'PM' ? styles.ampmSelected : styles.ampm,
                ]}
                onPress={() => setBirthTimePeriod('PM')}
              >
                <Text
                  style={[
                    birthTimePeriod === 'PM'
                      ? styles.ampmTextSelected
                      : styles.ampmText,
                  ]}
                >
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  header: {
    marginBottom: 24,
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
  datePickerContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeQuestion: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#d1d5dbe6',
    textAlign: 'left',
    marginBottom: 12,
    opacity: 0.9,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    marginBottom: 24,
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
  continueButton: {
    flex: 1,
    marginLeft: 16,
    height: 50,
    borderRadius: 8,
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
    color: '#d1d5dbe6',
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  input: {
    // backgroundColor: 'rgba(45, 17, 82, 0.3)',
    minWidth: 60,
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    borderRadius: 12,
    padding: 16,
    textAlign: 'center',
    color: `${Colors.gold.DEFAULT}`,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  amPmContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    borderRadius: 12,
    padding: 5,
    color: `${Colors.gold.DEFAULT}`,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },

  ampm: {
    paddingHorizontal: 10,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
  },
  ampmSelected: {
    backgroundColor: `${Colors.gold.DEFAULT}20`,
    // borderColor: `${Colors.gold.DEFAULT}20`,
    paddingHorizontal: 10,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    textAlign: 'center',
    alignItems: 'center',
  },
  ampmText: {
    fontSize: 16,
    color: `${Colors.gold.DEFAULT}40`,

    // marginBottom: 8,
  },
  ampmTextSelected: {
    color: Colors.white,
  },
  slashBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  inputSlash: {
    color: `${Colors.gold.DEFAULT}20`,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.deepPurple.dark,
    padding: 20,
    borderWidth: 5,
  },
});
