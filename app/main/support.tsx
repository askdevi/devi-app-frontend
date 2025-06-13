import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Animated, StatusBar
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import * as Linking from 'expo-linking';
import MaskedView from '@react-native-masked-view/masked-view';
import CustomDropdown from '@/components/CustomDropdown';
import CustomInput from '@/components/CustomInput';

export default function SupportScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false)
    const [error, setError] = useState('');

    const queryTopicData = [
        { label: 'General Query', value: 'General Query' },
        { label: 'Issue With Package', value: 'Issue With Package' },
        { label: 'Technical Support', value: 'Technical Support' },
        { label: 'Billing Issue', value: 'Billing Issue' }
    ];

    const handleSend = () => {
        if (!name || !topic || !message) {
            setError('Please fill all fields');
            return;
        }

        const subject = encodeURIComponent(`[${topic}] Support Request from ${name}`);
        const body = encodeURIComponent(`${message}\n\n${name}`);
        const mailto = `mailto:support@askdevi.com?subject=${subject}&body=${body}`;

        Linking.openURL(mailto).catch(err => {
            setError('Could not open email client');
        });
    };

    const handleBack = () => {
        router.back();
    };

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
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left', 'bottom']}>
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

                        <CustomInput
                            value={name}
                            onChange={setName}
                            label="Full Name"
                            errorMsg=""
                            placeholder="Enter your name"
                        />

                        <CustomDropdown
                            renderData={queryTopicData}
                            labelName="Topic"
                            placeholder="Select a topic"
                            selected={topic}
                            setSelected={setTopic}
                            search={false}
                        />

                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            style={[
                                styles.input,
                                styles.messageInput,
                                { borderColor: (message || isFocused) ? `${Colors.gold.DEFAULT}90` : `${Colors.gold.DEFAULT}20` }
                            ]}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type your message here..."
                            placeholderTextColor={`${Colors.gold.DEFAULT}20`}
                            onBlur={() => setIsFocused(false)}
                            onFocus={() => setIsFocused(true)}
                            multiline
                            numberOfLines={4}
                        />

                        <Animated.View
                            style={[
                                styles.sendButton,
                                !isFormValid && styles.sendButtonDisabled,
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
                                    <LinearGradient
                                        colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                                        style={styles.shimmerGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />

                                    <View style={styles.buttonContent}>
                                        <Text style={styles.sendButtonText}>Send Message</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                    {error && <Text style={styles.error}>{error}</Text>}
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
        fontSize: 16,
        color: '#d1d5dbe6',
        marginBottom: 8,
    },
    input: {
        // backgroundColor: '#3b1e69',
        borderRadius: 10,
        fontFamily: 'Poppins-Medium',
        borderWidth: 2,
        fontSize: 16,
        padding: 12,
        color: `${Colors.white}`,
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
    error: {
        color: 'red',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 0,
        textAlign: 'center',
    },
});
