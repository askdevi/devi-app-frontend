import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';

export default function DeviScreen() {
    const router = useRouter();

    const handleBack = () => {
        router.push('/main/home');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    <BackgroundEffects />
                    <View style={styles.headerContainer}>
                                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                                  <Ionicons 
                                    name="arrow-back" 
                                    size={24} 
                                    color="#ffcc00" 
                                  />
                                </TouchableOpacity>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.header}>Devi</Text>
                                    <LinearGradient
                                      colors={['rgba(255, 215, 0, 0)', '#FFA500', '#FFD700', '#FFA500', 'rgba(255, 215, 0, 0)']}
                                      start={{ x: 0, y: 0 }}
                                      end={{ x: 1, y: 0 }}
                                      locations={[0, 0.3, 0.5, 0.7, 1]}
                                      style={styles.underline}
                                    />
                                </View>
                              </View>
                    <ScrollView style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffcc00',
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
    deleteText: {
        color: '#ff8080',
        fontSize: 15,
    },
});
