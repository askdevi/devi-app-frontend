import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, BackHandler, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import ChatHistoryCard from '@/components/ChatHistoryCard';
import Domain from '@/constants/domain';
import axios from 'axios';
import MaskedView from '@react-native-masked-view/masked-view';
import { getUserId } from '@/constants/userId';
import { ActivityIndicator } from 'react-native';
import * as amplitude from '@amplitude/analytics-react-native';

const EmptyState = () => {
    const router = useRouter();

    return (
        <View style={styles.emptyStateContainer}>
            <Image
                source={require('../../assets/images/welcome.png')}
                style={styles.emptyStateImage}
            />
            <Text style={styles.emptyStateTitle}>No Chats Yet</Text>
            <Text style={styles.emptyStateText}>
                Start your first conversation with Devi to get personalized vedic insights
            </Text>
            <TouchableOpacity
                style={styles.startChatButton}
                onPress={() => {
                    amplitude.track('Clicked Start Chat Button', { screen: 'Chat History' });
                    router.navigate("/main/devi");
                }}
            >
                <LinearGradient
                    colors={['#FFD700', '#FFA500', '#FFD700']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startChatGradient}
                >
                    <Text style={styles.startChatText}>Start Chat</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default function ChatHistoryScreen() {
    const router = useRouter();
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const backAction = () => {
    //         router.back();
    //         return true;
    //     };

    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction
    //     );

    //     return () => backHandler.remove();
    // }, []);

    const handleBack = () => {
        router.back();
    };

    useEffect(() => {
        const loadChatHistory = async () => {
            amplitude.track('Fetching Chat History', { screen: 'Chat History' });
            try {
                const userId = await getUserId();
                const response = await axios.get(`${Domain}/chat-history`,
                    {
                        params: {
                            userId: userId
                        }
                    }
                );
                setChatHistory(response.data.chats);
                amplitude.track('Fetch Chat History Successful', { screen: 'Chat History' });
                setIsLoading(false);
            } catch (error: any) {
                amplitude.track('Failure: Fetch Chat History', { screen: 'Chat History', message: error.message });
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

    const handleChatHistoryDetail = (chat: any) => {
        amplitude.track('Clicked Chat History Detail Button', { screen: 'Chat History' });
        router.push({
            pathname: '/main/chat-history-detail',
            params: { chat: JSON.stringify(chat) }
        });
    };

    return (
        <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={[
                            styles.content,
                            (!chatHistory.length && !isLoading) && styles.emptyStateScrollContent
                        ]}
                        showsVerticalScrollIndicator={false}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="large" color={Colors.gold.DEFAULT} />
                        ) : chatHistory.length > 0 ? (
                            chatHistory.map((chat: any, id: any) => (
                                <ChatHistoryCard
                                    key={id}
                                    title={chat.date}
                                    preview={chat.messages[chat.messages.length - 1].content}
                                    onPress={() => handleChatHistoryDetail(chat)}
                                />
                            ))
                        ) : (
                            <EmptyState />
                        )}
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
    emptyStateScrollContent: {
        flexGrow: 1,
        // justifyContent: 'center',
    },
    emptyStateContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyStateImage: {
        width: 100,
        height: 200,
        marginBottom: 20,
        opacity: 0.8,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.gold.DEFAULT,
        marginBottom: 12,
    },
    emptyStateText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    startChatButton: {
        width: '100%',
        maxWidth: 200,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
    },
    startChatGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startChatText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.deepPurple.DEFAULT,
    },
});
