import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';

const calculateDiscount = (originalPrice: number, price: number) => {
  const discount = Math.floor(((originalPrice - price) / originalPrice) * 100);
  return discount > 0 ? discount : null;
};

const timePlans = [
  {
    name: "10 Minutes Access",
    duration: "10 Minutes",
    originalPrice: 99,
    price: 1,
    get discount() { return calculateDiscount(this.originalPrice, this.price); }
  },
  {
    name: '1 Hour Access',
    duration: '1 Hour',
    originalPrice: 299,
    price: 199,
    get discount() { return calculateDiscount(this.originalPrice, this.price); }
  },
  {
    name: '1 Day Access',
    duration: '1 Day',
    originalPrice: 599,
    price: 299,
    get discount() { return calculateDiscount(this.originalPrice, this.price); }
  },
];

export default function WalletScreen() {
  const router = useRouter();
  const [time, setTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const timeEnd1 = await AsyncStorage.getItem('timeEnd');
      const currentTime = Date.now();
      if (timeEnd1) {
        const timeEndTimestamp = new Date(timeEnd1).getTime();
        setTime(Math.max(0, timeEndTimestamp - currentTime));
      }
    };
    loadData();
  }, []);

  const handleBack = () => {
    router.push('/main/home');
  };

  const handlePurchase = async (pkg: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const userId = await getUserId();
      // 1. Create order on server
      const orderRes = await axios.post(`${Domain}/create-order`, { amount: pkg.price });
      const { orderId } = orderRes.data;
      if (!orderId) throw new Error('Order ID not returned');

      // 2. Open Razorpay

      const name = await AsyncStorage.getItem('firstName');
      const contact = await AsyncStorage.getItem('phoneNumber');

      const options = {
        key: 'rzp_live_ZebDbC0aL8Uh1O',
        amount: pkg.price * 100,
        currency: "INR",
        name: "Ask Devi",
        description: `${pkg.duration} Access Package`,
        order_id: orderId,
        // handler: async (response: any) => { },
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
          await AsyncStorage.setItem('timeEnd', newTimeEnd);
          const timeEndTimestamp = new Date(newTimeEnd).getTime();
          setTime(timeEndTimestamp - Date.now());
          router.push('/main/devi');
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

  const parseDuration = (duration: any) => {
    const [value, unit] = duration.split(' ');
    const num = parseInt(value, 10);
    switch (unit) {
      case 'Minutes': return num * 60 * 1000;
      case 'Hour':
      case 'Hours': return num * 60 * 60 * 1000;
      case 'Day':
      case 'Days': return num * 24 * 60 * 60 * 1000;
      default: return 0;
    }
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
            <Text style={styles.header}>Wallet</Text>
          </View>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceValue}>
                  {Math.floor(time / (1000 * 60 * 60))}h {Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))}m
                </Text>
                <Text style={styles.balanceLabel}>Remaining Time</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.packagesTitle}>Time Packages</Text>
            {timePlans.map((pkg, idx) => (
              <View key={idx} style={styles.packageCard}>
                {pkg.discount && <Text style={styles.discount}>{pkg.discount}% OFF</Text>}
                <Text style={styles.packageLabel}>{pkg.duration}</Text>
                <Text style={styles.packageSub}>Unlimited Questions</Text>
                {pkg.discount && <Text style={styles.strikePrice}>₹{pkg.originalPrice}</Text>}
                <Text style={styles.packagePrice}>₹{pkg.price}</Text>
                <TouchableOpacity
                  style={[styles.buyButton, isProcessing && { opacity: 0.5 }]}
                  onPress={() => handlePurchase(pkg)}
                  disabled={isProcessing}
                >
                  <Text style={styles.buyButtonText}>{isProcessing ? 'Processing...' : 'Buy Now'}</Text>
                </TouchableOpacity>
              </View>
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

  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00e68a',
  },
  balanceLabel: {
    color: '#ccc',
    marginTop: 4,
  },

  packagesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  packageCard: {
    backgroundColor: '#2b0050',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  discount: {
    color: '#ffcc00',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  packageLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  packageSub: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },

  strikePrice: {
    color: '#888',
    textDecorationLine: 'line-through',
    fontSize: 14,
    marginTop: 4,
  },

  packagePrice: {
    color: '#00e68a',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },

  buyButton: {
    backgroundColor: '#a05afc',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },

  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: '#4e2a7f',
    marginVertical: 20
  },

});
