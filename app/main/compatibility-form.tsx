import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Domain from '@/constants/domain';
import axios from 'axios';
import { getUserId } from '@/constants/userId';
import 'react-native-get-random-values';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { ActivityIndicator } from 'react-native';
import CustomInput from '@/components/CustomInput';
import CompactInput from '@/components/CompactInput';
import * as amplitude from '@amplitude/analytics-react-native';

export default function CompatibilityFormScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthPlace, setBirthPlace] = useState('');
    const [birthPlaceCoords, setBirthPlaceCoords] = useState({ latitude: 0, longitude: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // New state variables for date/time inputs
    const [isFocused, setIsFocused] = useState(false);
    const currentYear = new Date().getFullYear();
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [birthTimePeriod, setBirthTimePeriod] = useState<string>('');

    // Refs for inputs
    const monthRef = useRef<TextInput>(null);
    const yearRef = useRef<TextInput>(null);
    const hourRef = useRef<TextInput>(null);
    const minuteRef = useRef<TextInput>(null);

    // Validation functions
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

    const handleCheck = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const userId = await getUserId();

            // Convert the new date format
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

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

            const formattedTime = `${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;

            const response = await axios.post(`${Domain}/get-compatibility-report`, {
                userId,
                firstName,
                lastName,
                birthDate: formattedDate,
                birthTime: formattedTime,
                birthPlace: {
                    name: birthPlace,
                    latitude: birthPlaceCoords.latitude,
                    longitude: birthPlaceCoords.longitude
                }
            });

            const report = response.data;

            amplitude.track('Submit Compatibility Form Successful', { screen: 'Compatibility Form' });

            router.push({
                pathname: '/main/compatibility-report',
                params: { report: JSON.stringify(report), index: JSON.stringify(response.data.index) }
            });
        } catch (error: any) {
            amplitude.track('Failure: Submit Compatibility Form', { screen: 'Compatibility Form', message: error.message });
            setError('Failed to check compatibility. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     const backAction = () => {
    //         router.back();
    //         return true;
    //     };

    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction
    //     );

    //     return () => backHandler.remove();
    // }, []);

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>

                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color="#ffcc00" />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <GradientText style={styles.header}>Check Compatibility</GradientText>
                        </View>
                    </View>

                    <View
                        style={styles.scrollView}
                    >
                        <View style={styles.form}>

                            <View>
                                <CustomInput
                                    value={firstName}
                                    onChange={setFirstName}
                                    label="First Name"
                                    errorMsg=""
                                    placeholder="Enter First Name"
                                />
                            </View>
                            <View>
                                <CustomInput
                                    value={lastName}
                                    onChange={setLastName}
                                    label="Last Name"
                                    errorMsg=""
                                    placeholder="Enter Last Name"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Birth Place</Text>
                                <GooglePlacesAutocomplete
                                    placeholder="Enter Birth Location"
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
                                <View style={[
                                    styles.amPmContainer,
                                    {borderColor: birthTimePeriod != '' ? `${Colors.gold.DEFAULT}90`
                                    : `${Colors.gold.DEFAULT}20`}
                                 ]}>
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

                            {error && <Text style={styles.error}>{error}</Text>}

                            <View   
                                style={[
                                    styles.checkButton,
                                    !(firstName?.trim() && lastName?.trim() && day?.trim() && month?.trim() && year?.length === 4 && hour?.trim() && minute?.trim() && birthPlace?.trim() && birthTimePeriod?.trim()) && styles.checkButtonDisabled,
                                ]}
                            >
                                <TouchableOpacity
                                    style={styles.checkButtonTouchable}
                                    onPress={handleCheck}
                                    disabled={loading || !(firstName?.trim() && lastName?.trim() && day?.trim() && month?.trim() && year?.length === 4 && hour?.trim() && minute?.trim() && birthPlace?.trim())}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#FFD700', '#FF8C00', '#FFD700']}
                                        style={styles.checkButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />

                                    <View style={styles.buttonContent}>
                                        {loading ? (
                                            <>
                                                <ActivityIndicator
                                                    size="small"
                                                    color={Colors.deepPurple.DEFAULT}
                                                    style={{ marginRight: 8 }}
                                                />
                                                <Text style={styles.checkButtonText}>Checking...</Text>
                                            </>
                                        ) : (
                                            <Text style={styles.checkButtonText}>Check Compatibility</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
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
    content: {
        padding: 20,
        paddingTop: 30,
    },
    scrollView: {
        flex: 1,
        padding: 25,
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
        marginLeft: 20,
    },
    header: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.gold.DEFAULT,
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginTop: 12,
        marginBottom: 16,
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: Colors.labelGrey,
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
        justifyContent: 'center',
    },
    dateText: {
        color: Colors.white,
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
    checkButton: {
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
    checkButtonDisabled: {
        opacity: 0.5,
        shadowOpacity: 0,
    },
    checkButtonTouchable: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    checkButtonGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
    checkButtonText: {
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
