import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

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
            <TouchableOpacity
                style={styles.newCompatibilityContainer}
                onPress={() => router.push('/compatibility/compatibility-form')}
            >
                <View style={styles.header}>
                    <MaskedView
                        style={styles.titleContainer}
                        maskElement={
                            <Animated.Text style={[styles.titleMask, { backgroundColor: 'transparent' }]}>
                                Add Your Partner
                            </Animated.Text>
                        }
                    >
                        <LinearGradient
                            colors={['#FFD700', '#FF8C00', '#FFD700']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.titleContainer}
                        >
                            <Animated.Text style={[styles.titleMask, { opacity: 0 }]}>
                                Add Your Partner
                            </Animated.Text>
                        </LinearGradient>
                    </MaskedView>
                    <Text style={styles.subtitle}>Check your compatibility with other profiles</Text>
                </View>
                <View style={styles.circlesContainer}>
                    <View style={styles.nameCircle}>
                        <LinearGradient
                            colors={['#FFD700', '#FFA500', '#FF8C00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <Text style={styles.nameCircleText}>{initials}</Text>
                    </View>
                    <Text style={styles.plusSign}>+</Text>
                    <View
                        style={styles.circle}
                    >
                        <Text style={styles.circleText}>Add</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    newCompatibilityContainer: {
        padding: 30,
        backgroundColor: 'rgba(70, 10, 100, 0.35)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        // backgroundColor: 'rgba(102, 51, 153, 0.2)',
    },
    header: {
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 10,
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleMask: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#FFD700',
        opacity: 0.8,
        marginTop: 6,
        marginBottom: 20,
        textAlign: 'center',
    },
    circlesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    nameCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    nameCircleText: {
        color: Colors.deepPurple.DEFAULT,
        fontSize: 30,
        fontFamily: 'Poppins-Medium',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: 2,
        borderColor: Colors.gold.DEFAULT,
        borderStyle: 'dashed',
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
});

export default CompatibilitySection;