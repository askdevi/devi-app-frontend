import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    title: string;
    updatedAt: string;
    preview: string;
    onDelete?: () => void;
    onPress?: () => void;
}

const ChatHistoryCard = ({ title, updatedAt, preview, onDelete, onPress }: Props) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.row}>
                <Text style={styles.title}>
                    {new Date(title).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    })}
                </Text>
                <TouchableOpacity onPress={onDelete}>
                    <Ionicons name="trash-outline" size={20} color="#ff8080" />
                </TouchableOpacity>
            </View>
            <Text style={styles.updatedText}>Last updated:{" "}
                {new Date(updatedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })}
            </Text>
            <Text style={styles.preview} numberOfLines={2}>
                {preview}
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

export default ChatHistoryCard;
