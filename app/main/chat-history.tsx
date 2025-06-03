import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import ChatHistoryCard from '@/components/ChatHistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskedView from '@react-native-masked-view/masked-view';

export default function ChatHistoryScreen() {
    const router = useRouter();
    const [chatHistory, setChatHistory] = useState([]);

    const handleBack = () => {
        router.push('/main/home');
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
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color="#ffcc00" 
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <GradientText style={styles.header}>Chat History</GradientText>
            </View>
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
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
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
    },
    header: {
        fontFamily: 'Poppins-Bold',
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.gold.DEFAULT,
    },
    underline: {
        height: 3,
        width: 80,
        marginTop: 8,
        borderRadius: 1.5,
    },
});
