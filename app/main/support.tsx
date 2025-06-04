import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Button, Alert, Platform, Animated,
    BackHandler
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import * as Linking from 'expo-linking';
import Dropdown from '@/components/Setup/Dropdown';
import MaskedView from '@react-native-masked-view/masked-view';

export default function SupportScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');

    const topicItems = [
        'General Inquiry',
        'Issue with Tokens',
        'Payment Issues',
        'Technical Support',
        'Feedback and Suggestions',
    ];

    const gradientAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const glowAnimation = useRef(new Animated.Value(0)).current;

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

    useEffect(() => {
        const gradientLoop = Animated.loop(
            Animated.timing(gradientAnimation, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false,
            })
        );
        gradientLoop.start();

        const glowLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnimation, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnimation, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        );
        glowLoop.start();

        return () => {
            gradientLoop.stop();
            glowLoop.stop();
        };
    }, []);

    const handleSend = () => {
        if (!name || !topic || !message) {
            Alert.alert('Please fill all fields');
            return;
        }

        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: false,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }),
        ]).start();

        const subject = encodeURIComponent(`[${topic}] Support Request from ${name}`);
        const body = encodeURIComponent(`${message}\n\n${name}`);
        const mailto = `mailto:ashsangwaiya@gmail.com?subject=${subject}&body=${body}`;

        Linking.openURL(mailto).catch(err => {
            Alert.alert('Error', 'Could not open email client');
        });
    };

    const handleBack = () => {
        router.push('/main/home');
    };

    const gradientTranslateX = gradientAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    const glowOpacity = glowAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    const isFormValid = name.trim() && topic && message.trim();

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
                            <GradientText style={styles.header}>Contact Us</GradientText>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your name"
                            placeholderTextColor="#aaa"
                        />

                        <Dropdown
                            label="Topic"
                            value={topic}
                            items={topicItems}
                            onSelect={setTopic}
                            placeholder="Select a topic..."
                        />

                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            style={[styles.input, styles.messageInput]}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type your message here..."
                            placeholderTextColor="#aaa"
                            multiline
                            numberOfLines={4}
                        />

                        {/* <TouchableOpacity style={styles.button} onPress={handleSend}>
                            <Text style={styles.buttonText}>Send Message</Text>
                        </TouchableOpacity> */}
                        <Animated.View
                            style={[
                                styles.sendButton,
                                !isFormValid && styles.sendButtonDisabled,
                                {
                                    transform: [{ scale: scaleAnimation }],
                                    shadowOpacity: glowOpacity,
                                }
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.sendButtonTouchable}
                                onPress={handleSend}
                                disabled={!isFormValid}
                                activeOpacity={0.8}
                            >
                                <View style={styles.gradientContainer}>
                                    <LinearGradient
                                        colors={['#FFD700', '#FF8C00', '#FFD700']}
                                        style={styles.sendButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />

                                    <Animated.View
                                        style={[
                                            styles.animatedGradientOverlay,
                                            {
                                                transform: [{ translateX: gradientTranslateX }],
                                            },
                                        ]}
                                    >
                                        <LinearGradient
                                            colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                                            style={styles.shimmerGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        />
                                    </Animated.View>

                                    <View style={styles.buttonContent}>
                                        <Text style={styles.sendButtonText}>Send Message</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
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
    underline: {
        height: 3,
        width: 80,
        marginTop: 8,
        borderRadius: 1.5,
    },
    header: {
        fontFamily: 'Poppins-Bold',
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.gold.DEFAULT,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#d1d5dbe6',
        marginBottom: 8,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(45, 17, 82, 0.3)',
        borderWidth: 2,
        borderColor: `${Colors.gold.DEFAULT}20`,
        borderRadius: 12,
        padding: 16,
        color: Colors.white,
        marginBottom: 15,
    },
    messageInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#ffd500',
        marginTop: 30,
        borderRadius: 25,
        alignItems: 'center',
        paddingVertical: 12,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#3b1e69',
        fontSize: 16,
    },

    sendButton: {
        height: 50,
        borderRadius: 8,
        marginTop: 30,
        marginBottom: 24,
        shadowColor: Colors.gold.DEFAULT,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 10,
        elevation: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
        shadowOpacity: 0,
    },
    sendButtonTouchable: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientContainer: {
        flex: 1,
        position: 'relative',
    },
    sendButtonGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    animatedGradientOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 100,
        zIndex: 1,
    },
    shimmerGradient: {
        flex: 1,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        paddingHorizontal: 24,
        zIndex: 2,
        position: 'relative',
    },
    sendButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: Colors.deepPurple.DEFAULT,
        marginRight: 8,
        position: 'relative',
        zIndex: 10,
    },
});
