import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import { useLocalSearchParams } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    points?: number;
    total?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    size = 100,
    strokeWidth = 10,
    label,
    points,
    total
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = circumference - (percentage / 100) * circumference;

    return (
        <View style={styles.progressContainer}>
            <Svg width={size} height={size}>
                <Circle
                    stroke={`${Colors.gold.DEFAULT}20`}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={Colors.gold.DEFAULT}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            <View style={styles.progressContent}>
                <Text style={styles.progressPercentage}>{Math.round(percentage)}%</Text>
                {label && <Text style={styles.progressLabel}>{label}</Text>}
                {points !== undefined && (
                    <Text style={styles.progressPoints}>{points}/{total}</Text>
                )}
            </View>
        </View>
    );
};

interface Quality {
    received_points: number;
    total_points: number;
    title: string;
}

export default function CompatibilityReportScreen() {
    const router = useRouter();
    const { report } = useLocalSearchParams();
    const reportData = JSON.parse(report as string);

    useEffect(() => {
        const backAction = () => {
            router.push("/compatibility/compatibility-main")
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const handleBack = () => {
        router.push('/compatibility/compatibility-main');
    };

    const handleDelete = () => {
        // Add delete functionality here - could show confirmation dialog
        // For now, navigate back to main screen
        router.push('/compatibility/compatibility-main');
    };

    const totalPercentage = (reportData.received_points / reportData.total_points) * 100;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>

                    {/* Simple Back Button Header */}
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={28} color={Colors.gold.DEFAULT} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={24} color={Colors.gold.DEFAULT} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Combined Partner Info and Total Score Card */}
                        <View style={styles.combinedCard}>
                            {/* Partner Information Section */}
                            <View style={styles.partnerSection}>
                                <Text style={styles.partnerName}>{reportData.name}</Text>
                                <View style={styles.partnerDetailsContainer}>
                                    <View style={styles.partnerDetailRow}>
                                        <Ionicons name="calendar-outline" size={16} color={Colors.gold.DEFAULT} />
                                        <Text style={styles.partnerDetail}>{reportData.birthDate}</Text>
                                    </View>
                                    <View style={styles.partnerDetailRow}>
                                        <Ionicons name="time-outline" size={16} color={Colors.gold.DEFAULT} />
                                        <Text style={styles.partnerDetail}>{reportData.birthTime}</Text>
                                    </View>
                                    <View style={styles.partnerDetailRow}>
                                        <Ionicons name="location-outline" size={16} color={Colors.gold.DEFAULT} />
                                        <Text style={styles.partnerDetail}>{reportData.birthPlace.name}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Total Score Section */}
                            <View style={styles.totalScoreSection}>
                                <CircularProgress
                                    percentage={totalPercentage}
                                    size={120}
                                    strokeWidth={14}
                                    points={reportData.received_points}
                                    total={reportData.total_points}
                                    label="Total Score"
                                />
                            </View>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Qualities Breakdown */}
                            <View style={styles.qualitiesSection}>
                                <Text style={styles.sectionTitle}>Qualities Breakdown</Text>
                                <View style={styles.qualitiesGrid}>
                                    {reportData.qualities.map((quality: Quality, index: number) => (
                                        <View key={index} style={styles.qualityItem}>
                                            <CircularProgress
                                                percentage={(quality.received_points / quality.total_points) * 100}
                                                size={60}
                                                strokeWidth={6}
                                            />
                                            <View style={styles.qualityTextContainer}>
                                                <Text style={styles.qualityTitle}>{quality.title}</Text>
                                                <Text style={styles.qualityScore}>{quality.received_points}/{quality.total_points}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
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
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Combined Partner Info and Total Score Card
    combinedCard: {
        paddingHorizontal: 24,
        paddingTop: 24,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: 'rgba(80, 20, 120, 0.5)', // bg-purple-900/20
        borderRadius: 24, // rounded-lg
        borderColor: 'rgba(168, 85, 247, 0.3)',
    },
    partnerSection: {
        marginBottom: 24,
    },
    partnerName: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: Colors.gold.DEFAULT,
        textAlign: 'center',
        marginBottom: 15,
    },
    partnerDetailsContainer: {
        gap: 4,
    },
    partnerDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    partnerDetail: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.white,
        opacity: 0.9,
    },
    totalScoreSection: {
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(168, 85, 247, 0.3)',
        marginVertical: 24,
    },
    qualitiesSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.gold.DEFAULT,
        marginBottom: 24,
        textAlign: 'center',
    },
    qualitiesGrid: {
        gap: 16,
    },
    qualityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(80, 20, 120, 0.3)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.2)',
    },
    qualityTextContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    qualityTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.gold.DEFAULT,
        marginBottom: 4,
    },
    qualityScore: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.white,
        opacity: 0.8,
    },

    // Progress Components
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContent: {
        position: 'absolute',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: Colors.gold.DEFAULT,
    },
    progressLabel: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.white,
        textAlign: 'center',
        marginTop: 4,
        paddingHorizontal: 4,
        opacity: 0.9,
    },
    progressPoints: {
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
        color: `${Colors.gold.DEFAULT}70`,
        marginTop: 2,
    },
});
