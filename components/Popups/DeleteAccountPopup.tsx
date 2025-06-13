import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { ActivityIndicator } from 'react-native';

interface Props {
    onClose?: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

const PaymentFailedPopup = ({ onClose, onDelete, isDeleting }: Props) => {
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
                <Ionicons name="alert-circle" size={100} color="red" style={{ marginBottom: 20 }} />
                <Text style={[styles.title, { color: 'red' }]}>Delete Account</Text>
                <Text style={styles.subtitle}>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</Text>

                <View style={styles.buttons}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, { opacity: isDeleting ? 0.5 : 1 }]} onPress={onClose} disabled={isDeleting}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer1}>
                        <TouchableOpacity style={[styles.button, { opacity: isDeleting ? 0.5 : 1 }]} onPress={onDelete} disabled={isDeleting}>
                            {isDeleting ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText1}>Delete</Text>}
                        </TouchableOpacity>
                    </View>
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
        height: '45%',
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
    subtitle: {
        color: Colors.gold.DEFAULT,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginBottom: 30,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
    },
    buttonContainer: {
        width: "40%",
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: Colors.gold.DEFAULT,
    },
    buttonContainer1: {
        width: "40%",
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: "red",
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
    buttonText1: {
        color: "white",
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
    },
});

export default PaymentFailedPopup;
