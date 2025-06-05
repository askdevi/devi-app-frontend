import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, ArrowLeft} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import MaskedView from '@react-native-masked-view/masked-view';

export default function BirthPlaceScreen() {
  const router = useRouter();
  const [birthPlace, setBirthPlace] = useState('');
  const [birthPlaceCoords, setBirthPlaceCoords] = useState({ latitude: 0, longitude: 0 });
  const [isValidPlaceSelected, setIsValidPlaceSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
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
    console.log('handleContinue called');
    console.log('Current state:', {
      birthPlace,
      birthPlaceCoords,
      isValidPlaceSelected
    });
    // Animated.sequence([
    //   Animated.timing(scaleAnimation, {
    //     toValue: 0.95,
    //     duration: 100,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(scaleAnimation, {
    //     toValue: 1,
    //     duration: 100,
    //     useNativeDriver: false,
    //   }),
    // ]).start(() => {
    //   console.log('Scale animation completed');
    // });

    if (!isValidPlaceSelected || !birthPlace.trim()) {
      console.log('Validation failed:', {
        isValidPlaceSelected,
        birthPlace,
        birthPlaceTrimmed: birthPlace.trim()
      });
      Alert.alert(
        'Birth Place Required',
        'Please select your birth location before continuing.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    try {
      const birthPlaceData = {
        "latitude": birthPlaceCoords.latitude,
        "longitude": birthPlaceCoords.longitude,
        "name": birthPlace
      }
      console.log('Saving birthPlaceData to AsyncStorage:', birthPlaceData);
      await AsyncStorage.setItem('birthPlaceData', JSON.stringify(birthPlaceData));
      console.log('birthPlaceData saved successfully');
      console.log('Navigating to /register/personal-details');
      router.push('/register/personal-details' as any);
    } catch (error) {
      console.log('Error saving birth place data:', JSON.stringify(error));
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
  <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} accessible={false} >
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <SetupProgress currentStep={4} totalSteps={5} />

        <View style={styles.header}>
          <GradientText style={styles.title}>Birth Place</GradientText>
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
                  borderColor: (birthPlace.length>0 || isFocused)
                            ? `${Colors.gold.DEFAULT}90`
                            : `${Colors.gold.DEFAULT}20`,
                  borderRadius: 12,
                  padding: 16,
                  color: Colors.white,
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                  placeholderTextColor: `${Colors.gold.DEFAULT}20`,
                  // placeholderTextColor: `${Colors.gold.DEFAULT}40`,
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
              onFail={() => {}}
              onNotFound={() => {}}
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
                placeholderTextColor: `${Colors.gold.DEFAULT}20`,
                // placeholderTextColor: `${Colors.gold.DEFAULT}40`,
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
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={Colors.gradients.goldPrimary as [string, string, string]}
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
          The cosmos whispers your truth through time and space
        </Text>

      </View>
    </View>
  </TouchableWithoutFeedback>
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
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#d1d5dbe6',
    marginBottom: 8,
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
});