import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/build/Ionicons';

interface Props {
    onClose?: () => void;
}

const PaymentFailedPopup = ({ onClose }: Props) => {
    const router = useRouter();
    const buttonGradient = useRef(new Animated.Value(0)).current;
    return (
        <View style={styles.container}>
            <View style={styles.popup}>
                <LinearGradient
                    colors={['#1f0b3c', '#281048', '#341b43', '#341b43', '#341b43', '#381d39', '#381e3e', '#2b133f']}
                    style={styles.background}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X color={Colors.gold.DEFAULT} size={24} />
                </TouchableOpacity>
                <Ionicons name="alert-circle" size={100} color="red" style={{ marginBottom: 20 }} />
                <Text style={[styles.title, { color: 'red' }]}>Payment Failed</Text>
                <Text style={styles.title}>Please try again!</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        // paddingTop: 160,
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
        width: '80%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 20,
        borderRadius: 100,
        padding: 5,
    },
    logo: {
        width: 100,
        height: 100,
        zIndex: 10,
        marginBottom: 10,
        marginTop: 20,
    },
    title: {
        color: Colors.gold.DEFAULT,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    buttonContainer: {
        width: 180,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: Colors.gold.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginTop: 20,
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
        fontFamily: 'Poppins-SemiBold',
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

export default PaymentFailedPopup;
