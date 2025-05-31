import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Button, Alert, Platform
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import * as Linking from 'expo-linking';
import Dropdown from '@/components/Setup/Dropdown';

export default function SupportScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');

    const topicItems = [
        'General query',
        'Issue with tokens',
        'Technical support',
        'Billing issue'
    ];

    const handleSend = () => {
        if (!name || !topic || !message) {
            Alert.alert('Please fill all fields');
            return;
        }

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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
                <View style={styles.container}>
                    <BackgroundEffects count={30} />

                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={handleBack}>
                            <Text style={styles.backText}>{'<-'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.header}>Contact Us</Text>
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

                        <TouchableOpacity style={styles.button} onPress={handleSend}>
                            <Text style={styles.buttonText}>Send Message</Text>
                        </TouchableOpacity>
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
        color: Colors.gold.DEFAULT,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#3b1e69',
        borderRadius: 10,
        padding: 12,
        color: '#fff',
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
});
