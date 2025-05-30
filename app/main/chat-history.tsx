import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import ChatHistoryCard from '@/components/ChatHistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatHistoryScreen() {
    const router = useRouter();
    const [chatHistory, setChatHistory] = useState([]);

    const handleBack = () => {
        router.back();
    };

    useEffect(() => {
        const loadChatHistory = async () => {
            const chatHistory = await AsyncStorage.getItem('chatHistory');
            if (chatHistory) {
                setChatHistory(JSON.parse(chatHistory));
            }
        };
        loadChatHistory();
    }, []);
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    <BackgroundEffects count={30} />
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={handleBack}>
                            <Text style={styles.backText}>{'<-'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.header}>Chat History</Text>
                    </View>
                    <ScrollView style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}>
                        {chatHistory.map((chat: any, id: any) => (
                            <ChatHistoryCard key={id} title={chat.createdAt} updatedAt={chat.lastUpdated} preview={chat.messages[chat.messages.length - 1].content} />
                        ))}

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
});
