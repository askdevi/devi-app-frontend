import React from 'react';
import { WebView } from 'react-native-webview';
import Domain from '@/constants/domain';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function RazorpayScreen() {
    return (
        // <View style={styles.container}>
        <WebView
            source={{
                uri: `${Domain}/create-order?amount=1`,
                method: 'GET',
            }}
            onNavigationStateChange={(navState) => {
                if (navState.url.includes('payment-success')) {
                    // open razorpay payment page
                    
                }
                if (navState.url.includes('payment-failure')) {
                    // handle failure
                }
            }}
        />
        // </View>
    );
}
