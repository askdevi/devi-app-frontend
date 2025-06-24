import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking, BackHandler, StatusBar, Alert, Platform, PermissionsAndroid } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';
import axios from 'axios';
import MaskedView from '@react-native-masked-view/masked-view';
import messaging from '@react-native-firebase/messaging';
import DeleteAccountPopup from '@/components/Popups/DeleteAccountPopup';
import * as amplitude from '@amplitude/analytics-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const router = useRouter();
    const [error, setError] = useState('');

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);
    const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
    const [isCheckingSound, setIsCheckingSound] = useState(false);

    useEffect(() => {
        const checkSound = async () => {
            const soundOn = await AsyncStorage.getItem('soundOn');
            setSoundEnabled(soundOn === 'true');
        };
        checkSound();
    }, []);

    const handleSoundToggle = async () => {
        setIsCheckingSound(true);
        const soundOn = await AsyncStorage.getItem('soundOn');
        if (soundOn === 'true') {
            setSoundEnabled(false);
            amplitude.track('Turned Sound Off', { screen: 'Settings' });
            await AsyncStorage.setItem('soundOn', 'false');
        } else {
            setSoundEnabled(true);
            amplitude.track('Turned Sound On', { screen: 'Settings' });
            await AsyncStorage.setItem('soundOn', 'true');
        }
        setIsCheckingSound(false);
    };

    useEffect(() => {
        checkNotificationPermissions();

        // Set up app state listener to recheck permissions when app becomes active
        const subscription = {
            handleAppStateChange: (nextAppState: string) => {
                if (nextAppState === 'active') {
                    checkNotificationPermissions();
                }
            }
        };

        return () => {
            // Cleanup if needed
        };
    }, []);

    useEffect(() => {
        const backAction = () => {
            if (isDeleting) {
                return false;
            }
            else if (showDeleteAccountPopup) {
                setShowDeleteAccountPopup(false);
                return true;
            }
            else {
                router.back();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [isDeleting, showDeleteAccountPopup]);

    const checkNotificationPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                );
                setNotificationsEnabled(granted);
            } else {
                // For iOS, check Firebase messaging authorization status
                const authStatus = await messaging().hasPermission();
                const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
                setNotificationsEnabled(enabled);
            }
        } catch (error) {
            console.log('Error checking notification permissions:', error);
        }
    };

    const handleNotificationToggle = async (enabled: boolean) => {
        if (isCheckingPermissions) return;

        setIsCheckingPermissions(true);

        try {
            if (enabled) {
                amplitude.track('Clicked Enable Notifications Button', { screen: 'Settings' });
                // Request permissions
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        setNotificationsEnabled(true);
                    } else {
                        setNotificationsEnabled(false);
                        showPermissionAlert();
                    }
                } else {
                    // For iOS, request permission through Firebase
                    const authStatus = await messaging().requestPermission();
                    const permissionEnabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

                    if (permissionEnabled) {
                        setNotificationsEnabled(true);
                    } else {
                        setNotificationsEnabled(false);
                        showPermissionAlert();
                    }
                }
            } else {
                amplitude.track('Clicked Disable Notifications Button', { screen: 'Settings' });
                // Can't programmatically disable notifications, direct to settings
                setNotificationsEnabled(false);
                showSettingsAlert();
            }
        } catch (error) {
            console.log('Error toggling notifications:', error);
            setError('Failed to update notification settings');
        } finally {
            setIsCheckingPermissions(false);
        }
    };

    const showPermissionAlert = () => {
        Alert.alert(
            'Permission Required',
            'Notifications are currently disabled. To enable notifications, please go to Settings and allow notifications for this app.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: openSettings }
            ]
        );
    };

    const showSettingsAlert = () => {
        Alert.alert(
            'Disable Notifications',
            'To disable notifications, please go to your device Settings and turn off notifications for this app.',
            [
                { text: 'Cancel', onPress: () => setNotificationsEnabled(true), style: 'cancel' },
                { text: 'Open Settings', onPress: openSettings }
            ]
        );
    };

    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    const handleDeleteAccount = () => {
        amplitude.track('Clicked Delete Account Button', { screen: 'Settings' });
        setShowDeleteAccountPopup(true);
    };

    const confirmDeleteAccount = async () => {
        amplitude.track('Clicked Confirm Delete Account Button', { screen: 'Settings' });
        try {
            setIsDeleting(true);

            const userId = await getUserId();

            if (!userId) {
                setError("User Id not found. Please try logging in again.");
                return;
            }

            const response = await axios.delete(`${Domain}/delete-user`, {
                params: { userId }
            });

            if (response.status === 200) {
                SecureStore.deleteItemAsync('userId');
                amplitude.track('Delete Account Successful', { screen: 'Settings' });
                router.navigate('/signup/phone');
            } else {
                amplitude.track('Failure: Delete Account', { screen: 'Settings' });
                setError("Failed to delete account. Please try again.");
                setShowDeleteAccountPopup(false);
            }
        } catch (error: any) {
            amplitude.track('Failure: Delete Account', { screen: 'Settings', message: error.message });
            setError("Failed to delete account. Please try again.");
            setShowDeleteAccountPopup(false);
        } finally {
            setIsDeleting(false);
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
        <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#ffcc00"
                            />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <GradientText style={styles.header}>Settings</GradientText>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Notifications */}
                        <View style={styles.card}>
                            <Text style={styles.title}>Notifications</Text>
                            <View style={styles.row}>
                                <Text style={styles.subtitle}>Enable Notifications</Text>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={handleNotificationToggle}
                                    trackColor={{ false: '#999', true: '#ffcd00' }}
                                    thumbColor={notificationsEnabled ? '#a05afc' : '#ccc'}
                                    disabled={isCheckingPermissions}
                                />
                            </View>
                        </View>

                        {/* Sound */}
                        <View style={styles.card}>
                            <Text style={styles.title}>Sound</Text>
                            <View style={styles.row}>
                                <Text style={styles.subtitle}>Enable Sound</Text>
                                <Switch
                                    value={soundEnabled}
                                    onValueChange={() => {
                                        handleSoundToggle();
                                    }}
                                    trackColor={{ false: '#999', true: '#ffcd00' }}
                                    thumbColor={soundEnabled ? '#a05afc' : '#ccc'}
                                    disabled={isCheckingSound}
                                />
                            </View>
                        </View>

                        {/* Menu Options */}
                        {/* mail to support */}
                        <TouchableOpacity style={styles.option} onPress={() => {
                            amplitude.track('Clicked Support Button', { screen: 'Settings' });
                            Linking.openURL('mailto:support@askdevi.com');
                        }}>
                            <Text style={styles.optionText}>Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => {
                            amplitude.track('Clicked Terms and Conditions Button', { screen: 'Settings' });
                            Linking.openURL('https://askdevi.com/policies/terms-and-conditions');
                        }}>
                            <Text style={styles.optionText}>Terms and Conditions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => {
                            amplitude.track('Clicked Privacy Policy Button', { screen: 'Settings' });
                            Linking.openURL('https://askdevi.com/policies/privacy-policy');
                        }}>
                            <Text style={styles.optionText}>Privacy Policy</Text>
                        </TouchableOpacity>
                        {/* Delete Account */}
                        <TouchableOpacity
                            style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
                            onPress={handleDeleteAccount}
                            disabled={isDeleting}
                        >
                            <Text style={styles.deleteText}>
                                Delete Account
                            </Text>
                        </TouchableOpacity>
                        {error && <Text style={styles.error}>{error}</Text>}
                    </ScrollView>
                </View>
            </SafeAreaView>
            {showDeleteAccountPopup && <DeleteAccountPopup onClose={() => setShowDeleteAccountPopup(false)} onDelete={confirmDeleteAccount} isDeleting={isDeleting} />}
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
    },
    scrollView: {
        flex: 1,
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
    card: {
        backgroundColor: '#2b0050',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#ccc',
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    option: {
        padding: 16,
        backgroundColor: '#2b0050',
        borderRadius: 16,
        marginBottom: 12,
    },
    optionText: {
        color: '#aaa6f9',
        fontSize: 15,
    },
    logout: {
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    logoutText: {
        color: '#ffcc00',
        fontSize: 16,
    },
    deleteBtn: {
        borderColor: '#ff4d4d',
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
    },
    deleteBtnDisabled: {
        opacity: 0.6,
    },
    deleteText: {
        color: '#ff8080',
        fontSize: 15,
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
