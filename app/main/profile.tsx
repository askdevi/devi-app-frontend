import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking, Image, BackHandler, ImageSourcePropType, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '@/components/Footer';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import ProfilePics from '@/components/ProfilePics';
import * as amplitude from '@amplitude/analytics-react-native';

const profileImages = {
    'aquarius female': require('@/assets/images/profile/aquarius female.png'),
    'aquarius male': require('@/assets/images/profile/aquarius male.png'),
    'aries female': require('@/assets/images/profile/aries female.png'),
    'aries male': require('@/assets/images/profile/aries male.png'),
    'cancer female': require('@/assets/images/profile/cancer female.png'),
    'cancer male': require('@/assets/images/profile/cancer male.png'),
    'capricorn female': require('@/assets/images/profile/capricorn female.png'),
    'capricorn male': require('@/assets/images/profile/capricorn male.png'),
    'gemini female': require('@/assets/images/profile/gemini female.png'),
    'gemini male': require('@/assets/images/profile/gemini male.png'),
    'leo female': require('@/assets/images/profile/leo female.png'),
    'leo male': require('@/assets/images/profile/leo male.png'),
    'libra female': require('@/assets/images/profile/libra female.png'),
    'libra male': require('@/assets/images/profile/libra male.png'),
    'pisces female': require('@/assets/images/profile/pisces female.png'),
    'pisces male': require('@/assets/images/profile/pisces male.png'),
    'sagittarius female': require('@/assets/images/profile/sagittarius female.png'),
    'sagittarius male': require('@/assets/images/profile/sagittarius male.png'),
    'scorpio female': require('@/assets/images/profile/scorpio female.png'),
    'scorpio male': require('@/assets/images/profile/scorpio male.png'),
    'taurus female': require('@/assets/images/profile/taurus female.png'),
    'taurus male': require('@/assets/images/profile/taurus male.png'),
    'virgo female': require('@/assets/images/profile/virgo female.png'),
    'virgo male': require('@/assets/images/profile/virgo male.png'),
} as const;

type ProfilePicType = keyof typeof profileImages;

export default function SettingsScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [time, setTime] = useState(0);
    const [startedFreeMinutes, setStartedFreeMinutes] = useState(1);
    const [profilePic, setProfilePic] = useState('');
    const [showPopup, setShowPopup] = useState(false);

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


    const handleLogout = async () => {
        amplitude.track('Clicked Logout Button', { screen: 'Profile' });
        await SecureStore.deleteItemAsync('userId');
        router.navigate('/signup/phone');
    };

    const handleSupport = () => {
        amplitude.track('Clicked Support Button', { screen: 'Profile' });
        router.push('/main/support');
    };

    const handleSettings = () => {
        amplitude.track('Clicked Settings Button', { screen: 'Profile' });
        router.push('/main/settings');
    };

    const handleEditProfile = () => {
        amplitude.track('Clicked Edit Profile Button', { screen: 'Profile' });
        router.push('/main/edit-profile');
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
            const startedFreeMinutes1 = await AsyncStorage.getItem('startedFreeMinutes');
            const startedFreeMinutesInt = parseInt(startedFreeMinutes1 || '1');
            const currentTime = Date.now();
            if (timeEnd1) {
                const timeEndTimestamp = new Date(timeEnd1).getTime();
                setTime(Math.max(0, timeEndTimestamp - currentTime));
            }
            if (startedFreeMinutes1) {
                setStartedFreeMinutes(startedFreeMinutesInt);
            }
            const profilePic1 = await AsyncStorage.getItem('profilePic');
            if (profilePic1) {
                setProfilePic(profilePic1);
            }
        };
        loadData();

        const interval = setInterval(() => {
            loadData();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleProfilePic = async () => {
        const sign = await AsyncStorage.getItem('profilePic');
        if (sign) {
            setProfilePic(sign);
        }
        setShowPopup(false);
    };

    return (
        <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            {showPopup && <ProfilePics onClose={() => handleProfilePic()} />}
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
                                <View style={styles.touchableProfile}>
                                    {profilePic ? (
                                        <Image
                                            source={profileImages[profilePic as ProfilePicType]}
                                            style={styles.profileImageContent}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={styles.placeholderContainer}>
                                            <Ionicons name="person" size={60} color="rgba(255,255,255,0.5)" />
                                        </View>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => {
                                        amplitude.track('Clicked Edit Profile Picture Button', { screen: 'Profile' });
                                        setShowPopup(true);
                                    }}
                                >
                                    <View style={styles.editButtonInner}>
                                        <Ionicons name="pencil" size={16} color={Colors.deepPurple.DEFAULT} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.profileName}>{name}</Text>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <View style={styles.timeSection}>
                                        <Text style={styles.infoLabel}>Time Remaining</Text>
                                        <Text style={styles.timeText}>
                                            {startedFreeMinutes === 0 ? '00:03' : time > 0 ? `${String(Math.floor(time / (1000 * 60 * 60))).padStart(2, '0')}:${String(Math.ceil((time % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')}` : '00:00'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.addTimeButton}
                                        onPress={() => {
                                            amplitude.track('Clicked Add More Minutes (Wallet) Button', { screen: 'Profile' });
                                            router.navigate('/main/wallet');
                                        }}
                                    >
                                        <Text style={styles.addTimeButtonText}>Add More Minutes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.menuSection}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
                                <Ionicons name="pencil-outline" size={24} color="#FFD700" />
                                <Text style={styles.menuText}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
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
        overflow: 'visible',
        position: 'relative',
    },
    touchableProfile: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        overflow: 'hidden',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.deepPurple.DEFAULT,
    },
    editButtonInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    profileImageContent: {
        width: '110%',
        height: '110%',
        borderRadius: 60,
        transform: [{ scale: 1.01 }],
        marginLeft: '-5%',
        marginTop: '-5%',
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60,
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
        marginTop: 24,
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