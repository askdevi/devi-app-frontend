import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';

export default function SettingsScreen() {
    const router = useRouter();

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const handleLogout = () => {
        SecureStore.deleteItemAsync('userId');
        router.push('/(auth)/phone');
    };

    const handleDeleteAccount = () => {
        console.log('Delete account');
    };

    const handleBack = () => {
        router.back();
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
                        <Text style={styles.header}>Settings</Text>
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
                        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                            <Text style={styles.deleteText}>Delete my account</Text>
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
        paddingTop: 30,
    },
    scrollView: {
        flex: 1,
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
    deleteText: {
        color: '#ff8080',
        fontSize: 15,
    },
});
