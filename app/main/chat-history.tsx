import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import ChatHistoryCard from '@/components/ChatHistoryCard';
import Domain from '@/constants/domain';
import axios from 'axios';

export default function ChatHistoryScreen() {
    const router = useRouter();
    const [chatHistory, setChatHistory] = useState([]);

    const handleBack = () => {
        router.push('/main/home');
    };

    useEffect(() => {
        const loadChatHistory = async () => {
            try{
                const response = await axios.get(`${Domain}/chat-history`);
                // setChatHistory(response.data);
            } catch (error) {
                console.error('Error loading chat history:', error);
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
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color="#ffcc00" 
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.header}>Chat History</Text>
                <LinearGradient
                  colors={['rgba(255, 215, 0, 0)', '#FFA500', '#FFD700', '#FFA500', 'rgba(255, 215, 0, 0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  locations={[0, 0.3, 0.5, 0.7, 1]}
                  style={styles.underline}
                />
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
        paddingTop: 30,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  underline: {
    height: 3,
    width: 80,
    marginTop: 8,
    borderRadius: 1.5,
  },
});
