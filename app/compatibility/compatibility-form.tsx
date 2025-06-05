import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import { LinearGradient } from 'expo-linear-gradient';
import Domain from '@/constants/domain';
import axios from 'axios';
import { getUserId } from '@/constants/userId';
import DateTimePicker from '@react-native-community/datetimepicker';
import 'react-native-get-random-values';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { ActivityIndicator } from 'react-native';

export default function CompatibilityFormScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [birthPlace, setBirthPlace] = useState('');
    const [birthPlaceCoords, setBirthPlaceCoords] = useState({ latitude: 0, longitude: 0 });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);

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
        if (!firstName || !lastName) {
            alert('Please enter partner\'s name');
            return;
        }

        if(loading) return;
        setLoading(true);
        try {
            const userId = await getUserId();
            const formattedDate = date.toISOString().split('T')[0];
            const formattedTime = time.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });

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

            router.push({
                pathname: '/compatibility/compatibility-report',
                params: { report: JSON.stringify(report) }
            });
        } catch (error) {
            console.error('Error checking compatibility:', error);
            alert('Failed to check compatibility. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const backAction = () => {
            router.push("/compatibility/compatibility-main")
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const handleBack = () => {
        router.push('/compatibility/compatibility-main');
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    <BackgroundEffects count={30} />

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

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="Enter first name"
                                    placeholderTextColor={"#b3b3b3"}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Enter last name"
                                    placeholderTextColor={"#b3b3b3"}
                                />
                            </View>

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
                                    textInputProps={{}}
                                    timeout={20000}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Birth Date</Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={styles.dateText}>
                                        {date.toLocaleDateString()}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onDateChange}
                                    />
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Birth Time</Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Text style={styles.dateText}>
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </TouchableOpacity>
                                {showTimePicker && (
                                    <DateTimePicker
                                        value={time}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onTimeChange}
                                    />
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.checkButton}
                                onPress={handleCheck}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[Colors.gold.DEFAULT, Colors.gold.light]}
                                    style={styles.checkButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.checkButtonText}>
                                        {loading ? <ActivityIndicator size="small" color="#2D1152" /> : 'Check Compatibility'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
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
        backgroundColor: Colors.deepPurple.DEFAULT,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.deepPurple.DEFAULT,
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
        marginBottom: 24,
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
        justifyContent: 'center',
    },
    dateText: {
        color: Colors.white,
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    checkButton: {
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 16,
    },
    checkButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        paddingHorizontal: 24,
    },
    checkButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: Colors.deepPurple.DEFAULT,
    },
});
