import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated, KeyboardAvoidingView, Platform, FlatList, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Dropdown from '@/components/Setup/Dropdown';
import axios from 'axios';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';
import MaskedView from '@react-native-masked-view/masked-view';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
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
  const [birthPlaceCoords, setBirthPlaceCoords] = useState({ latitude: 0, longitude: 0 });
  const [isValidPlaceSelected, setIsValidPlaceSelected] = useState(false);
  const [language, setLanguage] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');

  const currentYear = new Date().getFullYear();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
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

  const validateYear = (text: string) => {
    let val = text;
    if (parseInt(val) > currentYear) val = currentYear.toString();
    const final = val.toString();
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

  const [originalValues, setOriginalValues] = useState({
    firstName: '',
    lastName: '',
    birthPlace: '',
    birthPlaceCoords: { latitude: 0, longitude: 0 },
    language: '',
    relationshipStatus: '',
    occupation: '',
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: '',
    birthTimePeriod: '',
    gender: '',
  });

  const gradientAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const googlePlacesRef = useRef<GooglePlacesAutocompleteRef>(null);

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
        const storedBirthPlace1 = await AsyncStorage.getItem('birthPlaceData');
        let storedLanguage = await AsyncStorage.getItem('language');
        let storedRelationshipStatus = await AsyncStorage.getItem('relationshipStatus');
        let storedOccupation = await AsyncStorage.getItem('occupation');
        let storedGender = await AsyncStorage.getItem('gender');
        const storedBirthPlace = storedBirthPlace1 ? JSON.parse(storedBirthPlace1) : null;
        const storedBirthDate = await AsyncStorage.getItem('birthDate');
        const storedBirthTime = await AsyncStorage.getItem('birthTime');
        const storedDay = storedBirthDate ? storedBirthDate.split('-')[2] : '';
        const storedMonth = storedBirthDate ? storedBirthDate.split('-')[1] : '';
        const storedYear = storedBirthDate ? storedBirthDate.split('-')[0] : '';
        const storedHour = storedBirthTime ? storedBirthTime.split(':')[0] : '';
        const storedMinute = storedBirthTime ? storedBirthTime.split(':')[1] : '';
        const storedBirthTimePeriod = storedBirthTime ? storedBirthTime.split(':')[0] < '12' ? 'AM' : 'PM' : '';


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
        if (storedBirthPlace) {
          setBirthPlace(storedBirthPlace.name);
          setBirthPlaceCoords({
            latitude: storedBirthPlace.latitude,
            longitude: storedBirthPlace.longitude
          });
        }

        if (storedLanguage) setLanguage(storedLanguage);
        if (storedRelationshipStatus) setRelationshipStatus(storedRelationshipStatus);
        if (storedOccupation) setOccupation(storedOccupation);
        if (storedGender) setGender(storedGender);
        if (storedDay) setDay(storedDay);
        if (storedMonth) setMonth(storedMonth);
        if (storedYear) setYear(storedYear);
        if (storedHour) setHour(storedHour);
        if (storedMinute) setMinute(storedMinute);
        if (storedBirthTimePeriod) setBirthTimePeriod(storedBirthTimePeriod);


        setOriginalValues({
          firstName: storedFirstName || '',
          lastName: storedLastName || '',
          birthPlace: storedBirthPlace.name || '',
          birthPlaceCoords: { latitude: storedBirthPlace.latitude, longitude: storedBirthPlace.longitude },
          language: storedLanguage || '',
          relationshipStatus: storedRelationshipStatus || '',
          occupation: storedOccupation || '',
          day: storedDay || '',
          month: storedMonth || '',
          year: storedYear || '',
          hour: storedHour || '',
          minute: storedMinute || '',
          birthTimePeriod: storedBirthTimePeriod || '',
          gender: storedGender || ''
        });
      } catch (e) {
        console.log('Error loading profile data', e);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (birthPlace && googlePlacesRef.current) {
      googlePlacesRef.current.setAddressText(birthPlace);
    }
  }, [birthPlace]);

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

    if (!isValidPlaceSelected || !birthPlace.trim()) {
      Alert.alert(
        'Birth Place Required',
        'Please select your birth location before continuing.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    if(!firstName.trim() || !lastName.trim()) {
      Alert.alert(
        'Name Required',
        'Please enter your name before continuing.',
        [{ text: 'OK', style: 'default' }]
      );
    }

    try {
      const userId = await getUserId();

      const response = await axios.post(`${Domain}/update-profile`, {
        userId,
        firstName,
        lastName,
        birthPlace: {
          name: birthPlace,
          latitude: birthPlaceCoords.latitude,
          longitude: birthPlaceCoords.longitude
        },
        preferredLanguage: language.toLowerCase(),
        relationshipStatus: relationshipStatus.toLowerCase(),
        occupation: occupation.toLowerCase(),
        gender: gender.toLowerCase(),
        birthDate: `${year}-${month}-${day}`,
        birthTime: `${birthTimePeriod === 'AM' ? hour : parseInt(hour) + 12}:${minute}`
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
      await AsyncStorage.setItem('birthPlaceData', JSON.stringify({
        name: birthPlace,
        latitude: birthPlaceCoords.latitude,
        longitude: birthPlaceCoords.longitude
      }));
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
    gender !== originalValues.gender ||
    day !== originalValues.day ||
    month !== originalValues.month ||
    year !== originalValues.year ||
    hour !== originalValues.hour ||
    minute !== originalValues.minute ||
    birthTimePeriod !== originalValues.birthTimePeriod;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
        {/* <View style={styles.container}> */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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

          {/* <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          > */}
          <FlatList
            data={[{ key: 'form' }]}
            renderItem={() => (
              <>
                <View style={styles.row}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.inputHalf}
                      placeholder="First Name"
                      placeholderTextColor="#ccc"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.inputHalf}
                      placeholder="Last Name"
                      placeholderTextColor="#ccc"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>

                <View style={styles.nameContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={[styles.input, { color: '#aaa' }]}
                    placeholder="Phone Number"
                    placeholderTextColor="#aaa"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Birth Location</Text>
                  <GooglePlacesAutocomplete
                    ref={googlePlacesRef}
                    placeholder="Enter your birth location"
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                      if (details) {
                        setBirthPlace(data.description);
                        setBirthPlaceCoords({
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng
                        });
                        setIsValidPlaceSelected(true);
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
                        placeholderTextColor: `${Colors.gold.DEFAULT}20`,
                      },
                      listView: {
                        backgroundColor: 'rgba(45, 17, 82, 1)',
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
                    onFail={() => { }}
                    onNotFound={() => { }}
                    onTimeout={() =>
                      console.warn('google places autocomplete: request timeout')
                    }
                    predefinedPlaces={[]}
                    predefinedPlacesAlwaysVisible={false}
                    suppressDefaultStyles={false}
                    textInputHide={false}
                    textInputProps={{
                      placeholderTextColor: `${Colors.gold.DEFAULT}20`,
                      onChangeText: (text) => {
                        if (text.length === 0) {
                          setIsValidPlaceSelected(false);
                          setBirthPlace('');
                        }
                      }
                    }}
                    timeout={20000}
                  />
                </View>

                <Text style={styles.label}>Birth Date</Text>
                <View style={styles.datePickerContainer}>
                  <TextInput
                    style={[styles.input, { width: 46 }]}
                    value={day}
                    onChangeText={validateDay}
                    placeholder="DD"
                    placeholderTextColor={"#ccc"}
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="next"
                  />
                  <View style={styles.slashBox}>
                    <Text style={styles.inputSlash}>/</Text>
                  </View>
                  <TextInput
                    ref={monthRef}
                    style={[styles.input, { width: 53 }]}
                    value={month}
                    onChangeText={validateMonth}
                    placeholder="MM"
                    placeholderTextColor={"#ccc"}
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="next"
                  />
                  <View style={styles.slashBox}>
                    <Text style={styles.inputSlash}>/</Text>
                  </View>
                  <TextInput
                    ref={yearRef}
                    style={[styles.input, { width: 63 }]}
                    value={year}
                    onChangeText={validateYear}
                    placeholder="YYYY"
                    placeholderTextColor={"#ccc"}
                    keyboardType="number-pad"
                    maxLength={4}
                    returnKeyType="done"
                  />
                </View>

                <Text style={styles.label}>Birth Time</Text>
                <View style={styles.datePickerContainer}>
                  <TextInput
                    ref={hourRef}
                    style={styles.input}
                    value={hour}
                    onChangeText={validateHour}
                    placeholder="HH"
                    placeholderTextColor={"#ccc"}
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="next"
                  />
                  <View style={styles.slashBox}>
                    <Text style={styles.inputSlash}>:</Text>
                  </View>
                  <TextInput
                    ref={minuteRef}
                    style={styles.input}
                    value={minute}
                    onChangeText={validateMinute}
                    placeholder="MM"
                    placeholderTextColor={"#ccc"}
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="done"
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
              </>
            )}
            keyExtractor={(item) => item.key}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16 }}
          />
        </KeyboardAvoidingView>
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
  inputGroup: {
    marginBottom: 20,
    // zIndex: 10,
  },
  nameContainer: {
    flex: 0.48,
  },
  inputHalf: {
    padding: 12,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 20,
    paddingRight: 60,
    marginTop: 5,
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
    marginTop: -15,
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
  },
  ampmTextSelected: {
    color: `${Colors.gold.DEFAULT}`,
  },
  slashBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop: -15,
  },
  inputSlash: {
    color: `${Colors.gold.DEFAULT}20`,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 30,
  },
  input: {
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    color: '#fff',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#d1d5dbe6',
    marginBottom: 8,
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
