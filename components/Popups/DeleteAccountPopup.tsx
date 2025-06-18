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

const DeleteAccountPopup = ({ onClose, onDelete, isDeleting }: Props) => {
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

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
                    </View>
                    <Text style={styles.title}>Delete Account</Text>
                    <Text style={styles.subtitle}>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { opacity: isDeleting ? 0.5 : 1 }]}
                            onPress={onClose}
                            disabled={isDeleting}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.deleteButton, { opacity: isDeleting ? 0.5 : 1 }]}
                            onPress={onDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            )}
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
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        color: Colors.gold.light,
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 32,
        textAlign: 'center',
        opacity: 0.9,
        lineHeight: 20,
        paddingHorizontal: 8,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        borderWidth: 1,
        borderColor: Colors.gold.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FF4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: Colors.gold.DEFAULT,
        fontWeight: '600',
        fontSize: 16,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default DeleteAccountPopup;
