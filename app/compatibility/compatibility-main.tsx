import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, BackHandler, Platform } from 'react-native';
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
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import ShinyButton from '@/components/ShinyButton';


export default function CompatibilityScreen() {
    const router = useRouter();

    useEffect(() => {
        const backAction = () => {
            router.push("/main/home")
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const [loading, setLoading] = useState(true);
    const [compatibility, setCompatibility] = useState([]);

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

    const GradientText = ({ children, style }: { children: string; style?: any }) => {
        return (
            <MaskedView
                style={style}
                maskElement={
                    <Text style={[style, { backgroundColor: 'transparent' }]}>
                        {children}
                    </Text>
                }
            >
                <LinearGradient
                    colors={['#FFD700', '#FF8C00', '#FFD700']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={style}
                >
                    <Text style={[style, { opacity: 0 }]}>{children}</Text>
                </LinearGradient>
            </MaskedView>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>

                    <View style={styles.headerContainer}>
                        <View style={styles.titleContainer}>
                            <GradientText style={styles.header}>Partner Compatibility</GradientText>
                        </View>
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
                                        score={{
                                            received: item.received_points,
                                            total: item.total_points
                                        }}
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
                        <ShinyButton
                            title="Add New Partner"
                            onPress={() => router.push('/compatibility/compatibility-form')}
                        />
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
        backgroundColor: "hsl(274, 100%, 10%)",
    },
    container: {
        flex: 1,
        backgroundColor: "hsl(274, 100%, 10%)",
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
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.gold.DEFAULT,
    },
    backText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardContainer: {
        marginBottom: 5,
    },
    newCompatibilityContainer: {
        // height: "27%",
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Platform.OS === 'ios' ? 100 : 80,
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
