import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '@/components/Footer';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [time, setTime] = useState(0);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        router.replace('/signup/phone');
    };

    const handleSupport = () => {
        router.push('/main/support');
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

    useEffect(() => {
        const loadData = async () => {
            const firstName = await AsyncStorage.getItem('firstName') as string;
            setName(firstName);
            const timeEnd1 = await AsyncStorage.getItem('timeEnd');
            const currentTime = Date.now();
            if (timeEnd1) {
                const timeEndTimestamp = new Date(timeEnd1).getTime();
                setTime(Math.max(0, timeEndTimestamp - currentTime));
            }
        };
        loadData();

        const interval = setInterval(() => {
            loadData();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <View style={styles.titleContainer}>
                            <GradientText style={styles.header}>Profile</GradientText>
                        </View>
                    </View>
                    <ScrollView style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.profileSection}>
                            <View style={styles.profileImageContainer}>
                                <View style={styles.profileImage}>
                                    <Ionicons name="person" size={60} color="rgba(255,255,255,0.5)" />
                                </View>
                            </View>
                            <Text style={styles.profileName}>{name}</Text>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <View style={styles.timeSection}>
                                        <Text style={styles.infoLabel}>Time Remaining</Text>
                                        <Text style={styles.timeText}>
                                            {Math.floor(time / (1000 * 60 * 60)) > 0
                                                ? `${Math.floor(time / (1000 * 60 * 60))}h ${Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))}m`
                                                : `${Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))}m`
                                            }
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.addTimeButton}
                                        onPress={() => router.push('/main/wallet')}
                                    >
                                        <Text style={styles.addTimeButtonText}>Add More Minutes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.menuSection}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/main/edit-profile')}>
                                <Ionicons name="pencil-outline" size={24} color="#FFD700" />
                                <Text style={styles.menuText}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/main/settings')}>
                                <Ionicons name="settings-outline" size={24} color="#FFD700" />
                                <Text style={styles.menuText}>Settings</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
                                <Ionicons name="help-circle-outline" size={24} color="#FFD700" />
                                <Text style={styles.menuText}>Support</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={24} color="#FFD700" />
                                <Text style={styles.menuText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <Footer />
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
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.gold.DEFAULT,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#FFD700',
        marginBottom: 16,
        padding: 3,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    infoContainer: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeSection: {
        flex: 1,
    },
    infoLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 4,
    },
    timeText: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
    },
    addTimeButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginLeft: 16,
    },
    addTimeButtonText: {
        color: Colors.deepPurple.DEFAULT,
        fontSize: 14,
        fontWeight: 'bold',
    },
    menuSection: {
        width: '100%',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    menuText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 16,
    },
});