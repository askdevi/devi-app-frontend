import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, StatusBar, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import axios from 'axios';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';
import MaskedView from '@react-native-masked-view/masked-view';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import CompactInput from '@/components/CompactInput';
import CustomInput from '@/components/CustomInput';
import CustomDropdown from '@/components/CustomDropdown';
import PhoneTextInput from '@/components/PhoneTextInput';
import * as amplitude from '@amplitude/analytics-react-native';

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
  { label: 'Self-Employed', value: 'Self-employed' },
  { label: 'Homemaker', value: 'Homemaker' },
  { label: 'Student', value: 'Student' },
  { label: 'Other', value: 'Other' },
];
const genderData = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
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
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [birthTimePeriod, setBirthTimePeriod] = useState<string>('AM');

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

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
  const [isFocused, setIsFocused] = useState(false);
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

  const googlePlacesRef = useRef<GooglePlacesAutocompleteRef>(null);


  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          storedFirstName,
          storedLastName,
          storedPhoneNumber,
          storedBirthPlace1,
          storedLanguageRaw,
          storedRelationshipStatusRaw,
          storedOccupationRaw,
          storedGenderRaw,
          storedBirthDate,
          storedBirthTime
        ] = await Promise.all([
          AsyncStorage.getItem('firstName'),
          AsyncStorage.getItem('lastName'),
          AsyncStorage.getItem('phoneNumber'),
          AsyncStorage.getItem('birthPlaceData'),
          AsyncStorage.getItem('language'),
          AsyncStorage.getItem('relationshipStatus'),
          AsyncStorage.getItem('occupation'),
          AsyncStorage.getItem('gender'),
          AsyncStorage.getItem('birthDate'),
          AsyncStorage.getItem('birthTime')
        ]);

        const storedBirthPlace = storedBirthPlace1 ? JSON.parse(storedBirthPlace1) : null;
        const storedDay = storedBirthDate ? storedBirthDate.split('-')[2] : '';
        const storedMonth = storedBirthDate ? storedBirthDate.split('-')[1] : '';
        const storedYear = storedBirthDate ? storedBirthDate.split('-')[0] : '';
        const storedHour = storedBirthTime ? storedBirthTime.split(':')[0] : '';
        const storedMinute = storedBirthTime ? storedBirthTime.split(':')[1] : '';
        const storedBirthTimePeriod = storedBirthTime ? storedBirthTime.split(':')[0] < '12' ? 'AM' : 'PM' : '';

        if (!storedLanguageRaw || !storedRelationshipStatusRaw || !storedOccupationRaw || !storedGenderRaw) return;

        // capitalize the first letter of the stored values
        const storedLanguage = storedLanguageRaw?.charAt(0).toUpperCase() + storedLanguageRaw?.slice(1);
        const storedRelationshipStatus = storedRelationshipStatusRaw?.charAt(0).toUpperCase() + storedRelationshipStatusRaw?.slice(1);
        const storedOccupation = storedOccupationRaw?.charAt(0).toUpperCase() + storedOccupationRaw?.slice(1);
        const storedGender = storedGenderRaw?.charAt(0).toUpperCase() + storedGenderRaw?.slice(1);

        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedPhoneNumber) {
          const phoneWithoutCountryCode = storedPhoneNumber?.split("+91")[1];
          setPhoneNumber(phoneWithoutCountryCode || storedPhoneNumber);
        }
        if (storedBirthPlace) {
          setBirthPlace(storedBirthPlace.name);
          setBirthPlaceCoords({
            latitude: storedBirthPlace.latitude,
            longitude: storedBirthPlace.longitude,
          });
          setIsValidPlaceSelected(true);
        }

        if (storedLanguage) setLanguage(storedLanguage);
        if (storedRelationshipStatus)
          setRelationshipStatus(storedRelationshipStatus);
        if (storedOccupation) {
          setOccupation(storedOccupation);
        }
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
          birthPlace: storedBirthPlace?.name || '',
          birthPlaceCoords: {
            latitude: storedBirthPlace?.latitude || 0,
            longitude: storedBirthPlace?.longitude || 0,
          },
          language: storedLanguage || '',
          relationshipStatus: storedRelationshipStatus || '',
          occupation: storedOccupation || '',
          day: storedDay || '',
          month: storedMonth || '',
          year: storedYear || '',
          hour: storedHour || '',
          minute: storedMinute || '',
          birthTimePeriod: storedBirthTimePeriod || '',
          gender: storedGender || '',
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
    router.back();
  };

  const handleUpdate = async () => {
    amplitude.track('Clicked Update Profile Button', { screen: 'Edit Profile' });
    setUpdating(true);

    try {

      const userId = await getUserId();

      // Convert 12-hour format to 24-hour format
      let hour24 = parseInt(hour);

      if (birthTimePeriod === 'AM') {
        // Handle AM times
        if (hour24 === 12) {
          hour24 = 0; // 12 AM is midnight (00:xx)
        }
        // 1-11 AM remain the same
      } else {
        // Handle PM times
        if (hour24 !== 12) {
          hour24 += 12; // 1-11 PM become 13-23
        }
        // 12 PM remains 12 (noon)
      }

      const birthTime = `${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;

      if (!birthPlace) {
        setBirthPlace(originalValues.birthPlace);
        setBirthPlaceCoords(originalValues.birthPlaceCoords);
      }

      const response = await axios.post(
        `${Domain}/update-profile`,
        {
          userId,
          firstName,
          lastName,
          birthPlace: {
            name: birthPlace,
            latitude: birthPlaceCoords.latitude,
            longitude: birthPlaceCoords.longitude,
          },
          preferredLanguage: language.toLowerCase(),
          relationshipStatus: relationshipStatus.toLowerCase(),
          occupation: occupation.toLowerCase(),
          gender: gender.toLowerCase(),
          birthDate: `${year}-${month}-${day}`,
          birthTime: birthTime,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status != 200) {
        setError('Error updating profile');
        return;
      }
      // Save all data in parallel
      await Promise.all([
        AsyncStorage.setItem('firstName', firstName),
        AsyncStorage.setItem('lastName', lastName),
        AsyncStorage.setItem('phoneNumber', `+91${phoneNumber}`),
        AsyncStorage.setItem(
          'birthPlaceData',
          JSON.stringify({
            name: birthPlace,
            latitude: birthPlaceCoords.latitude,
            longitude: birthPlaceCoords.longitude,
          })
        ),
        AsyncStorage.setItem('birthDate', `${year}-${month}-${day}`),
        AsyncStorage.setItem('birthTime', birthTime),
        AsyncStorage.setItem('language', language.toLowerCase()),
        AsyncStorage.setItem('relationshipStatus', relationshipStatus.toLowerCase()),
        AsyncStorage.setItem('occupation', occupation.toLowerCase()),
        AsyncStorage.setItem('gender', gender.toLowerCase()),
      ]);
      amplitude.track('Update Profile Successful', { screen: 'Edit Profile' });
      router.push('/main/profile');
    } catch (e: any) {
      amplitude.track('Update Profile Failed', { screen: 'Edit Profile', message: e.message });
      setError('Error saving profile data');
    } finally {
      setUpdating(false);
    }
  };

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

  const isFormValid =
    firstName?.trim() !== originalValues.firstName ||
    lastName?.trim() !== originalValues.lastName ||
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
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
        {/* <View style={styles.container}> */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#ffcc00" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <GradientText style={styles.header}>Edit Profile</GradientText>
            </View>
          </View>
          <FlatList
            data={[{ key: 'form' }]}
            renderItem={() => (
              <>
                <View style={styles.row}>
                  <View style={styles.nameContainer}>
                    <CustomInput
                      value={firstName}
                      onChange={setFirstName}
                      label="First Name"
                      errorMsg=""
                      placeholder="Enter your first name"
                    />
                  </View>
                  <View style={styles.nameContainer}>
                    <CustomInput
                      value={lastName}
                      onChange={setLastName}
                      label="Last Name"
                      errorMsg=""
                      placeholder="Enter your last name"
                    />
                  </View>
                </View>
                <PhoneTextInput
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  editable={false}
                  label='Phone Number'
                  onChange={setPhoneNumber}
                />

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
                          longitude: details.geometry.location.lng,
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
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderColor:
                          (birthPlace.length > 0 || isFocused)
                            ? `${Colors.gold.DEFAULT}90`
                            : `${Colors.gold.DEFAULT}20`,
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
                        marginTop: 4,
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
                      onFocus: () => setIsFocused(true),
                      onBlur: () => setIsFocused(false),
                      placeholderTextColor: `${Colors.gold.DEFAULT}40`,
                      onChangeText: (text) => {
                        if (text.length === 0) {
                          if (!birthPlace || birthPlace !== text) {
                            setIsValidPlaceSelected(false);
                            setBirthPlace('');
                          }
                        }
                      },
                    }}
                    timeout={20000}
                  />
                </View>

                <Text style={styles.label}>Birth Date</Text>
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
                    returnKeyType="next"
                    width={60}
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

                <Text style={styles.label}>Birth Time</Text>
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
                        birthTimePeriod === 'AM'
                          ? styles.ampmSelected
                          : styles.ampm,
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
                        birthTimePeriod === 'PM'
                          ? styles.ampmSelected
                          : styles.ampm,
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

                <CustomDropdown
                  renderData={relationshipStatusData}
                  labelName="Relationship Status"
                  placeholder="Select Relationship Status"
                  // required
                  selected={relationshipStatus}
                  setSelected={setRelationshipStatus}
                  search={false}
                />
                <CustomDropdown
                  renderData={languageData}
                  labelName="Preferred Language"
                  placeholder="Select Preferred Language"
                  // required
                  selected={language}
                  setSelected={setLanguage}
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
                <CustomDropdown
                  renderData={genderData}
                  labelName="Gender"
                  placeholder="Select Gender"
                  // required
                  selected={gender}
                  setSelected={setGender}
                  search={false}
                />

                {error && <Text style={styles.error}>{error}</Text>}

                <View
                  style={[
                    styles.continueButton,
                    !(isFormValid && firstName?.trim() && lastName?.trim() && phoneNumber?.trim() && day?.trim() && month?.trim() && year?.length === 4 && hour?.trim() && minute?.trim() && relationshipStatus?.trim() && language?.trim() && occupation?.trim() && gender?.trim()) && styles.continueButtonDisabled,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.continueButtonTouchable}
                    onPress={handleUpdate}
                    disabled={updating || !(isFormValid && firstName?.trim() && lastName?.trim() && phoneNumber?.trim() && day?.trim() && month?.trim() && year?.length === 4 && hour?.trim() && minute?.trim() && relationshipStatus?.trim() && language?.trim() && occupation?.trim() && gender?.trim())}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#FFD700', '#FF8C00', '#FFD700']}
                      style={styles.continueButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />

                    <View style={styles.buttonContent}>
                      {updating ? (
                        <>
                          <ActivityIndicator
                            size="small"
                            color={Colors.deepPurple.DEFAULT}
                            style={{ marginRight: 8 }}
                          />
                          <Text style={styles.continueButtonText}>Updating...</Text>
                        </>
                      ) : (
                        <Text style={styles.continueButtonText}>Update Your Profile</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: "hsl(274, 100%, 10%)",
  },
  container: {
    flex: 1,
    backgroundColor: "hsl(274, 100%, 10%)",
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
    padding: 10,
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
    alignSelf: 'center',
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
    borderColor: `${Colors.gold.DEFAULT}90`,
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
  },
  ampmTextSelected: {
    color: Colors.white,
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
    fontSize: 16,
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
    marginTop: 20,
    marginBottom: 36,
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
  error: {
    color: 'red',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 0,
    textAlign: 'center',
  },
});
