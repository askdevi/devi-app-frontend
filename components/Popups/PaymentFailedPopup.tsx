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
                    colors={Colors.gradients.purplePrimary}
                    style={styles.background}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X color={Colors.gold.DEFAULT} size={24} />
                </TouchableOpacity>
                <View style={styles.iconContainer}>
                    <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
                </View>
                <Text style={styles.title}>Payment Failed</Text>
                <Text style={styles.subtitle}>Please try again!</Text>
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
        // borderColor: 'rgba(255, 215, 0, 0.15)',
        borderColor: 'rgba(168, 85, 247, 0.2)',
    },
    popup: {
        width: '82%',
        height: '35%',
        paddingVertical: 40,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        borderRadius: 20,
        padding: 8,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    iconContainer: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
    },
    title: {
        color: '#FF6B6B',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: Colors.gold.light,
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        opacity: 0.9,
    },
});

export default PaymentFailedPopup;
