import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
    setTime: (time: number) => void;
    onClose?: () => void;
}

const calculateDiscount = (originalPrice: number, price: number) => {
    const discount = Math.floor(((originalPrice - price) / originalPrice) * 100);
    return discount > 0 ? discount : null;
};

const pkg = {
    name: '1 Hour Access',
    duration: '1 Hour',
    originalPrice: 299,
    price: 199,
    get discount() { return calculateDiscount(this.originalPrice, this.price); }
}

const NoTimePopup = ({ onClose, setTime }: Props) => {
    const buttonGradient = useRef(new Animated.Value(0)).current;
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePurchase = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            const userId = await getUserId();
            // 1. Create order on server
            const orderRes = await axios.post(`${Domain}/create-order`, { amount: pkg.price });
            const { orderId } = orderRes.data;
            if (!orderId) throw new Error('Order ID not returned');

            // 2. Open Razorpay

            const name = await AsyncStorage.getItem('firstName') || '';
            const contact = await AsyncStorage.getItem('phoneNumber') || '';

            const options = {
                key: 'rzp_live_ZebDbC0aL8Uh1O',
                amount: pkg.price * 100,
                currency: "INR",
                name: "Ask Devi",
                description: `${pkg.duration} Access Package`,
                order_id: orderId,
                prefill: {
                    name: name,
                    email: '',
                    contact: contact,
                },
                theme: { color: Colors.deepPurple.DEFAULT },
            };
            RazorpayCheckout.open(options).then(async (payment: any) => {
                // 3. Verify payment
                const verifyRes = await axios.post(`${Domain}/verify-payment`, {
                    razorpay_payment_id: payment.razorpay_payment_id,
                    userId,
                    tokensBought: 0,
                    timeDuration: pkg.duration,
                    amountPaid: pkg.price,
                });
                if (verifyRes.data.success) {
                    // Alert.alert('Payment Success', `Your ${pkg.duration} access is now active.`);
                    // Update local storage or state
                    const newTimeEnd = verifyRes.data.timeEnd;
                    const timeEndTimestamp = new Date(newTimeEnd).getTime();
                    setTime(timeEndTimestamp - Date.now());
                    onClose?.();
                    await AsyncStorage.setItem('timeEnd', newTimeEnd);
                } else {
                    throw new Error('Verification failed');
                }
            }).catch((error: any) => {
                console.error(error);
                Alert.alert('Payment Failed', 'Transaction was not completed. Please try again.');
            });
        } catch (e: any) {
            console.error(e);
            Alert.alert('Error', e.message || 'Something went wrong.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.popup}>
                <LinearGradient
                    colors={['#1f0b3c', '#281048', '#341b43', '#341b43', '#341b43', '#381d39', '#381e3e', '#2b133f']}
                    style={styles.background}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X color={Colors.gold.DEFAULT} size={18} />
                </TouchableOpacity>
                <Text style={styles.title}>No time left</Text>
                <View style={styles.packageCard}>
                    <Text style={styles.discount}>{pkg.discount}% OFF</Text>
                    <Text style={styles.packageLabel}>{pkg.duration}</Text>
                    <Text style={styles.packageSub}>Unlimited Questions</Text>
                    <Text style={styles.strikePrice}>₹{pkg.originalPrice}</Text>
                    <Text style={styles.packagePrice}>₹{pkg.price}</Text>
                </View>
                <Pressable style={styles.buttonContainer} onPress={() => handlePurchase()}>
                    <LinearGradient
                        colors={Colors.gradients.goldPrimary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.button, isProcessing && { opacity: 0.5 }]}
                    >
                        <Text style={styles.buttonText}>{isProcessing ? 'Processing...' : 'Buy Now'}</Text>
                        <Animated.View
                            style={[
                                styles.buttonShine,
                                {
                                    transform: [{
                                        translateX: buttonGradient.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-100, 200]
                                        })
                                    }]
                                }
                            ]}
                        />
                    </LinearGradient>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100%",
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        // paddingTop: 160,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 15,
    },
    popup: {
        width: '80%',
        height: '45%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        borderRadius: 100,
        borderColor: Colors.gold.DEFAULT,
        borderWidth: 2,
        padding: 5,
    },
    logo: {
        width: 180,
        height: 180,
        zIndex: 10,
        marginBottom: 10,
    },
    title: {
        color: Colors.gold.DEFAULT,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    packageCard: {
        backgroundColor: '#2b0050',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        width: '80%',
        alignItems: 'center',
    },
    discount: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: '#581c87',
        backgroundColor: Colors.gold.DEFAULT,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    packageLabel: {
        color: Colors.gold.DEFAULT,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
    },

    packageSub: {
        color: '#ccc',
        fontSize: 18,
        marginBottom: 4,
    },

    strikePrice: {
        color: '#888',
        textDecorationLine: 'line-through',
        fontSize: 16,
        marginTop: 10,
    },

    packagePrice: {
        color: Colors.gold.DEFAULT,
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    buttonContainer: {
        width: 180,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: Colors.gold.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginTop: 10,
    },
    button: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        overflow: 'hidden',
    },
    buttonText: {
        color: Colors.deepPurple.DEFAULT,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
    },
    buttonShine: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 120,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        transform: [{ skewX: '-25deg' }],
        borderRadius: 60,
    },
});

export default NoTimePopup;
