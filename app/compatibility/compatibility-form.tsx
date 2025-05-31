import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
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

export default function CompatibilityFormScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [birthPlace, setBirthPlace] = useState('');
    const [birthPlaceCoords, setBirthPlaceCoords] = useState({ latitude: 0, longitude: 0 });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        if (!name) {
            alert('Please enter partner\'s name');
            return;
        }

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
                name: name,
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
                        <TouchableOpacity onPress={handleBack}>
                            <Text style={styles.backText}>{'<-'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.header}>Check Partner Compatibility</Text>
                    </View>

                    <View
                        style={styles.scrollView}
                    >
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Partner's Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter name"
                                    placeholderTextColor={`${Colors.gold.DEFAULT}40`}
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
                                        {loading ? 'Checking...' : 'Check Compatibility'}
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
        padding: 20,
    },
    backText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 20,
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
