import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import Footer from '@/components/Footer';
import { ActivityIndicator } from 'react-native';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';
import axios from 'axios';
import CompatibilityCard from '@/components/CompatibilityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CompatibilityScreen() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [compatibility, setCompatibility] = useState([]);
    const [initials, setInitials] = useState('');

    useEffect(() => {
        const fetchCompatibility = async () => {
            try {
                const userId = await getUserId();
                const response = await axios.get(`${Domain}/get-past-compatibility-reports`, {
                    params: {
                        userId: userId
                    }
                });
                setCompatibility(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching compatibility:', error);
                setLoading(false);
            }
        };
        fetchCompatibility();
    }, []);

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
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    <BackgroundEffects count={30} />

                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Partner Compatibility</Text>
                    </View>
                    <ScrollView style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {loading ? (
                            <ActivityIndicator size="large" color={Colors.gold.DEFAULT} />
                        ) : compatibility.length > 0 ? (
                            compatibility.map((item: any, key: number) => (
                                <View key={key} style={styles.cardContainer}>
                                    <CompatibilityCard
                                        name={item.name}
                                        date={item.birthDate}
                                        time={item.birthTime}
                                        location={item.birthPlace.name}
                                        onPress={() => router.push({
                                            pathname: '/compatibility/compatibility-report',
                                            params: { report: JSON.stringify(item) }
                                        })}
                                    />
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No compatibilities yet</Text>
                                <Text style={styles.emptySubText}>Add your first compatibility check below</Text>
                            </View>
                        )}
                    </ScrollView>
                    <View style={styles.newCompatibilityContainer}>
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
                    <Footer />
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
    cardContainer: {
        marginBottom: 20,
    },
    newCompatibilityContainer: {
        borderTopWidth: 1,
        borderTopColor: Colors.gold.DEFAULT,
        height: "25%",
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
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: Colors.white,
        marginBottom: 8,
    },
    emptySubText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: `${Colors.gold.DEFAULT}80`,
        textAlign: 'center',
    },
});
