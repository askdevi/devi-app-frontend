import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CompatibilitySection = () => {
    const router = useRouter();
    const [initials, setInitials] = useState('');

    useEffect(() => {
        const fetchInitials = async () => {
            const firstName = await AsyncStorage.getItem('firstName');
            const lastName = await AsyncStorage.getItem('lastName');
            if (firstName && lastName) {
                setInitials(firstName[0] + lastName[0]);
            }
        }
        fetchInitials();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.newCompatibilityContainer}>
                <Text style={styles.title}>Check Partner Compatibility</Text>
                <View style={styles.circlesContainer}>
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>{initials}</Text>
                    </View>
                    <Text style={styles.plusSign}>+</Text>
                    <TouchableOpacity
                        style={styles.circle}
                        onPress={() => router.push('/compatibility/compatibility-form')}
                    >
                        <Text style={styles.circleText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CompatibilitySection;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    newCompatibilityContainer: {
        borderWidth: 1,
        borderColor: Colors.gold.DEFAULT,
        borderRadius: 20,
        padding: 30,
    },
    circlesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: 2,
        borderColor: Colors.gold.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleText: {
        color: Colors.gold.DEFAULT,
        fontSize: 24,
        fontFamily: 'Poppins-Medium',
    },
    plusSign: {
        color: Colors.gold.DEFAULT,
        fontSize: 30,
        fontFamily: 'Poppins-Medium',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.gold.DEFAULT,
        marginBottom: 20,
    },
});