import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image, ScrollView, Dimensions, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as amplitude from '@amplitude/analytics-react-native';

interface Props {
    onClose?: () => void;
}

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

type SignType = keyof typeof profileImages;

const signs: SignType[] = [
    'aquarius female', 'aquarius male', 'aries female', 'aries male',
    'cancer female', 'cancer male', 'capricorn female', 'capricorn male',
    'gemini female', 'gemini male', 'leo female', 'leo male',
    'libra female', 'libra male', 'pisces female', 'pisces male',
    'sagittarius female', 'sagittarius male', 'scorpio female', 'scorpio male',
    'taurus female', 'taurus male', 'virgo female', 'virgo male'
];

const ProfilePics = ({ onClose }: Props) => {
    const router = useRouter();
    const buttonGradient = useRef(new Animated.Value(0)).current;
    const windowWidth = Dimensions.get('window').width;
    const imageSize = (windowWidth * 0.8 - 50) / 4;

    const formatName = (filename: string) => {
        const [sign] = filename.split(' ');
        return sign.charAt(0).toUpperCase() + sign.slice(1);
    };

    const handleProfilePic = async (sign: SignType) => {
        amplitude.track("Changed Profile Picture", { screen: 'Profile' });
        await AsyncStorage.setItem('profilePic', sign);
        onClose?.();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    style={styles.popup}
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    <LinearGradient
                        colors={['#1f0b3c', '#281048', '#341b43', '#341b43', '#341b43', '#381d39', '#381e3e', '#2b133f']}
                        style={styles.background}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    />
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Change Profile Pic</Text>
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollViewContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.gridContainer}>
                                {signs.map((sign, index) => (
                                    <View key={index} style={styles.signWrapper}>
                                        <TouchableOpacity
                                            style={[styles.signContainer, { width: imageSize, height: imageSize }]}
                                            onPress={() => { handleProfilePic(sign) }}
                                        >
                                            <Image
                                                source={profileImages[sign]}
                                                style={[styles.signImage, { width: imageSize, height: imageSize }]}
                                            />
                                        </TouchableOpacity>
                                        <Text style={styles.signName}>{formatName(sign)}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 15,
    },
    popup: {
        width: '90%',
        height: '55%',
        borderRadius: 15,
        overflow: 'hidden',
        padding: 10,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        color: Colors.gold.DEFAULT,
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollViewContent: {
        paddingVertical: 10,
        paddingBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    signWrapper: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 20,
    },
    signContainer: {
        marginBottom: 5,
    },
    signImage: {
        borderRadius: 1000,
    },
    signName: {
        color: "white",
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
});

export default ProfilePics;
