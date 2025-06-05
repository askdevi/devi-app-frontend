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

    const totalPercentage = (reportData.received_points / reportData.total_points) * 100;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    <BackgroundEffects count={30} />

                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color="#ffcc00" />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={styles.header}>Check Compatibility</Text>
                        </View>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.partnerInfo}>
                            <Text style={styles.partnerName}>{reportData.name}</Text>
                            <Text style={styles.partnerDetail}>{reportData.birthDate}</Text>
                            <Text style={styles.partnerDetail}>{reportData.birthTime}</Text>
                            <Text style={styles.partnerDetail}>{reportData.birthPlace.name}</Text>
                        </View>

                        <View style={styles.totalScoreContainer}>
                            <CircularProgress
                                percentage={totalPercentage}
                                size={160}
                                strokeWidth={15}
                                points={reportData.received_points}
                                total={reportData.total_points}
                                label="Total Score"
                            />
                        </View>

                        <Text style={styles.reportText}>{reportData.report}</Text>

                        <View style={styles.qualitiesContainer}>
                            <Text style={styles.sectionTitle}>Qualities Breakdown</Text>
                            <View style={styles.qualitiesGrid}>
                                {reportData.qualities.map((quality: Quality, index: number) => (
                                    <View key={index} style={styles.qualityItem}>
                                        <CircularProgress
                                            percentage={(quality.received_points / quality.total_points) * 100}
                                            size={120}
                                            strokeWidth={8}
                                            points={quality.received_points}
                                            total={quality.total_points}
                                            label={quality.title}
                                        />
                                    </View>
                                ))}
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
        backgroundColor: Colors.deepPurple.DEFAULT,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.deepPurple.DEFAULT,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
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
        marginLeft: 20,
    },
    header: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.gold.DEFAULT,
    },
    partnerInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    partnerName: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: Colors.gold.DEFAULT,
        marginBottom: 8,
    },
    partnerDetail: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.white,
        opacity: 0.8,
        marginBottom: 4,
    },
    totalScoreContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    reportText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: Colors.white,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.gold.DEFAULT,
        marginBottom: 20,
        textAlign: 'center',
    },
    qualitiesContainer: {
        paddingTop: 20,
    },
    qualitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 20,
    },
    qualityItem: {
        width: '45%',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContent: {
        position: 'absolute',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: Colors.gold.DEFAULT,
    },
    progressLabel: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: Colors.white,
        textAlign: 'center',
        marginTop: 4,
        paddingHorizontal: 8,
    },
    progressPoints: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: `${Colors.gold.DEFAULT}80`,
        marginTop: 2,
    },
});
