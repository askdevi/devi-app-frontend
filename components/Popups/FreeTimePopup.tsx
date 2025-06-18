import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    onClose?: () => void;
}

const FreeTimePopup = ({ onClose }: Props) => {
    const router = useRouter();
    const buttonGradient = useRef(new Animated.Value(0)).current;
    return (
        <View style={styles.container}>
            <View style={styles.popup}>
                <LinearGradient
                    // colors={Colors.gradients.purplePrimary}
                    colors={['#1f0b3c', '#281048', '#341b43', '#341b43', '#341b43', '#381d39',
                        '#381e3e', '#2b133f']}
                    style={styles.background}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X color={Colors.gold.DEFAULT} size={24} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <Image
                        source={require('../../assets/images/welcome.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Free 3-minute chat</Text>
                    <Text style={styles.subtitle}>unlocked!</Text>

                    <Pressable style={styles.buttonContainer} onPress={() => router.push('/main/devi')}>
                        <LinearGradient
                            colors={Colors.gradients.goldPrimary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Chat Now</Text>
                            <Animated.View
                                style={[
                                    styles.buttonShine,
                                    {
                                        transform: [{
                                            translateX: buttonGradient.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-100, 200]
                                            })
                                        }]
                                    }
                                ]}
                            />
                        </LinearGradient>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100%",
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(168, 85, 247, 0.2)',
    },
    popup: {
        width: '82%',
        maxWidth: 340,
        paddingVertical: 40,
        paddingHorizontal: 24,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: 24,
    },
    title: {
        color: Colors.gold.DEFAULT,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        color: Colors.gold.light,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 32,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 200,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: Colors.gold.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    button: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        overflow: 'hidden',
    },
    buttonText: {
        color: Colors.deepPurple.DEFAULT,
        fontWeight: '600',
        fontSize: 16,
    },
    buttonShine: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 120,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        transform: [{ skewX: '-25deg' }],
        borderRadius: 60,
    },
});

export default FreeTimePopup;
