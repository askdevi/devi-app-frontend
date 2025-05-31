import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    name: string;
    date: string;
    time: string;
    location: string;
    onDelete?: () => void;
    onPress?: () => void;
}

const CompatibilityCard = ({ name, date, time, location, onDelete, onPress }: Props) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.row}>
                <Text style={styles.title}>
                    {name}
                </Text>
                {/* <TouchableOpacity onPress={onDelete}>
                    <Ionicons name="trash-outline" size={20} color="#ff8080" />
                </TouchableOpacity> */}
            </View>
            <Text style={styles.updatedText}>Birth Time:{" "}
                {date} at {time}
            </Text>
            <Text style={styles.preview} numberOfLines={2}>
                Birth Place: {location}
            </Text>
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
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffe545',
    },
    updatedText: {
        fontSize: 12,
        color: '#aaa',
        marginBottom: 8,
    },
    preview: {
        fontSize: 14,
        color: '#ddd',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
});

export default CompatibilityCard;
