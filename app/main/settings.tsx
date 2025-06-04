import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking, Alert, BackHandler } from 'react-native';
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

export default function SettingsScreen() {
    const router = useRouter();

    useEffect(() => {
        const backAction = () => {
            router.push("/main/home")
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLogout = () => {
        SecureStore.deleteItemAsync('userId');
        router.push('/signup/phone');
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: confirmDeleteAccount
                }
            ]
        );
        console.log('Delete account');
    };

    const confirmDeleteAccount = async () => {
        try {
            setIsDeleting(true);

            const userId = await getUserId();
            console.log('User ID:', userId);

            if (!userId) {
                Alert.alert("Error", "User ID not found. Please try logging in again.");
                return;
            }

            const response = await axios.delete(`${Domain}/delete-user`, {
                params: { userId }
            });

            if (response.status === 200) {
                Alert.alert(
                    "Account Deleted",
                    "Your account has been successfully deleted.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                SecureStore.deleteItemAsync('userId');
                                router.push('/signup/phone');
                            }
                        }
                    ]
                );
            } else {
                Alert.alert("Error", "Failed to delete account. Please try again.");
            }
        } catch (error) {
            console.error('Delete account error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBack = () => {
        router.push('/main/home');
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
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    {/* <BackgroundEffects count={30} /> */}

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
                            {/* <LinearGradient
                                colors={['rgba(255, 215, 0, 0)', '#FFA500', '#FFD700', '#FFA500', 'rgba(255, 215, 0, 0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                locations={[0, 0.3, 0.5, 0.7, 1]}
                                style={styles.underline}
                            /> */}
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
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: '#999', true: '#ffcd00' }}
                                    thumbColor={notificationsEnabled ? '#a05afc' : '#ccc'}
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
                                    onValueChange={setSoundEnabled}
                                    trackColor={{ false: '#999', true: '#ffcd00' }}
                                    thumbColor={soundEnabled ? '#a05afc' : '#ccc'}
                                />
                            </View>
                        </View>

                        {/* Menu Options */}
                        {/* mail to support */}
                        <TouchableOpacity style={styles.option} onPress={() => Linking.openURL('mailto:support@askdevi.com')}>
                            <Text style={styles.optionText}>Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => Linking.openURL('https://askdevi.com/policies/terms-and-conditions')}>
                            <Text style={styles.optionText}>Terms and Conditions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => Linking.openURL('https://askdevi.com/policies/privacy-policy')}>
                            <Text style={styles.optionText}>Privacy Policy</Text>
                        </TouchableOpacity>

                        {/* Logout */}
                        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>

                        {/* Delete Account */}
                        <TouchableOpacity
                            style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
                            onPress={handleDeleteAccount}
                            disabled={isDeleting}
                        >
                            <Text style={styles.deleteText}>
                                {isDeleting ? 'Deleting account...' : 'Delete my account'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
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
        // paddingTop: 30,
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
});
