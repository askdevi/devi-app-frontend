import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
                        <TouchableOpacity onPress={handleBack}>
                            <Text style={styles.backText}>{'<-'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.header}>Devi</Text>
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
