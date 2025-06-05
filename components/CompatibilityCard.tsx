import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import Colors from '@/constants/Colors';

interface Props {
    name: string;
    date: string;
    time: string;
    location: string;
    score?: {
        received: number;
        total: number;
    };
    onDelete?: () => void;
    onPress?: () => void;
}

const CircularProgress = ({ percentage, size = 40, strokeWidth = 4 }: { percentage: number, size?: number, strokeWidth?: number }) => {
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
            <Text style={styles.progressText}>{Math.round(percentage)}%</Text>
        </View>
    );
};

const CompatibilityCard = ({ name, date, time, score, onDelete, onPress }: Props) => {
    const percentage = score ? (score.received / score.total) * 100 : 0;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.cardContent}>
                <View style={styles.leftSection}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.updatedText}>
                        Birth Time: {date} at {time}
                    </Text>
                </View>
                <View style={styles.rightSection}>
                    <CircularProgress percentage={percentage} size={50} strokeWidth={5} />
                    <Text style={styles.scoreText}>
                        {score?.received || 0}/{score?.total || 0}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#3a006f',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flex: 1,
        paddingRight: 16,
    },
    rightSection: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 16,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 215, 0, 0.2)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffe545',
        marginBottom: 8,
    },
    updatedText: {
        fontSize: 13,
        color: '#aaa',
    },
    scoreText: {
        fontSize: 12,
        color: Colors.gold.DEFAULT,
        marginTop: 4,
        fontFamily: 'Poppins-Medium',
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 50,
        height: 50,
    },
    progressText: {
        position: 'absolute',
        fontSize: 12,
        color: Colors.gold.DEFAULT,
        fontFamily: 'Poppins-Medium',
    },
});

export default CompatibilityCard;
