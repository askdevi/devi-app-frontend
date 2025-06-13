import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Domain from '@/constants/domain';
import { getUserId } from '@/constants/userId';
import Footer from '@/components/Footer';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';
import PaymentFailedPopup from '@/components/Popups/PaymentFailedPopup';

const calculateDiscount = (originalPrice: number, price: number) => {
  const discount = Math.floor(((originalPrice - price) / originalPrice) * 100);
  return discount > 0 ? discount : null;
};

const timePlans = [
  {
    name: '10 Minutes Access',
    duration: '10 Minutes',
    originalPrice: 99,
    price: 99,
    get discount() { return calculateDiscount(this.originalPrice, this.price); }
  },
  {
    name: '1 Hour Access',
    duration: '1 Hour',
    originalPrice: 299,
    price: 199,
    glow: true,
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
  const [processingPackageIndex, setProcessingPackageIndex] = useState<number | null>(null);
  const [startedFreeMinutes, setStartedFreeMinutes] = useState(1);
  const [showPaymentFailedPopup, setShowPaymentFailedPopup] = useState(false);

  const glowOpacity = useSharedValue(0.5);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      glowOpacity.value,
      [0.5, 0.8],
      ['rgba(255, 215, 0, 0.1)', 'rgba(253, 185, 49, 0.2)']
    );

    return {
      backgroundColor,
      transform: [{ scale: glowScale.value }],
      borderRadius: 16,
      opacity: glowOpacity.value,
    };
  });

  useEffect(() => {
    const loadData = async () => {
      const timeEnd1 = await AsyncStorage.getItem('timeEnd');
      const startedFreeMinutes1 = await AsyncStorage.getItem('startedFreeMinutes');
      const startedFreeMinutesInt = parseInt(startedFreeMinutes1 || '1');
      const currentTime = Date.now();
      if (timeEnd1) {
        const timeEndTimestamp = new Date(timeEnd1).getTime();
        setTime(Math.max(0, timeEndTimestamp - currentTime));
      }
      if (startedFreeMinutes1) {
        setStartedFreeMinutes(startedFreeMinutesInt);
      }
    };
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handlePurchase = async (pkg: any, index: number) => {
    if (processingPackageIndex !== null) return;
    setProcessingPackageIndex(index);
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
          const newTimeEnd = verifyRes.data.timeEnd;
          const timeEndTimestamp = new Date(newTimeEnd).getTime();
          setTime(timeEndTimestamp - Date.now());
          await AsyncStorage.setItem('timeEnd', newTimeEnd);
          router.navigate('/main/devi');
        } else {
          throw new Error('Verification failed');
        }
      }).catch((error: any) => {
        setShowPaymentFailedPopup(true);
      });
    } catch (e: any) {
      setShowPaymentFailedPopup(true);
    } finally {
      setProcessingPackageIndex(null);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (showPaymentFailedPopup) {
        setShowPaymentFailedPopup(false);
        return true;
      }
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [showPaymentFailedPopup]);

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
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <GradientText style={styles.header}>Wallet</GradientText>
            </View>
          </View>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceValue}>
                  {startedFreeMinutes === 0 ? '00:03' : time > 0 ? `${String(Math.floor(time / (1000 * 60 * 60))).padStart(2, '0')}:${String(Math.ceil((time % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')}` : '00:00'}
                </Text>
                <Text style={styles.balanceLabel}>Remaining Time</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.packagesTitle}>Time Packages</Text>
            {timePlans.map((pkg, idx) => (
              <Animated.View key={idx} style={[styles.packageCard, pkg.glow && { borderColor: '#8d6c19', borderWidth: 2 }]}>
                {pkg.glow && (
                  <Animated.View style={[styles.glowWrapper, glowStyles]} />
                )}
                {pkg.discount && (
                  <Text style={styles.discount}>{pkg.discount}% OFF</Text>
                )}
                <View style={{ margin: 16 }}>
                  <Text style={styles.packageLabel}>{pkg.duration}</Text>
                  <Text style={styles.packageSub}>Unlimited Questions</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}
                  >
                    <Text style={[styles.packagePrice, { marginRight: 10 }]}>
                      ₹{pkg.price}
                    </Text>
                    {pkg.discount && (<Text style={styles.strikePrice}> ₹{pkg.originalPrice} </Text>)}
                  </View>
                  <TouchableOpacity
                    style={[styles.buyButton, processingPackageIndex !== null && { opacity: 0.5 }]}
                    onPress={() => handlePurchase(pkg, idx)}
                    disabled={processingPackageIndex !== null}
                  >
                    <LinearGradient
                      colors={['#a05afc', '#7c3aed', '#5b21b6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientButton}
                    >
                      <Ionicons name="card-outline" color={Colors.white} size={20} />
                      <Text style={styles.buyButtonText}>
                        {processingPackageIndex === idx ? (
                          <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                          'Buy Now'
                        )}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
          <Footer />
        </View>
      </SafeAreaView>
      {showPaymentFailedPopup && <PaymentFailedPopup onClose={() => setShowPaymentFailedPopup(false)} />}
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
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    marginBottom: 70,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
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
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.gold.DEFAULT,
  },
  underline: {
    height: 3,
    width: 80,
    marginTop: 8,
    borderRadius: 1.5,
  },
  balanceContainer: {
    marginTop: 10,
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
    color: Colors.gold.DEFAULT,
  },
  balanceLabel: {
    color: '#ccc',
    marginTop: 4,
  },

  packagesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 5,
  },

  packageCard: {
    height: 170,
    position: 'relative',
    backgroundColor: 'rgba(80, 20, 120, 0.5)', // bg-purple-900/20
    borderRadius: 20, // rounded-lg
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    marginBottom: 16,
  },

  discount: {
    backgroundColor: `${Colors.gold.DEFAULT}`,
    opacity: 0.9,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 16,
    position: 'absolute',
    textAlign: 'center',
    right: 0,
    color: '#000',
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
    fontSize: 16,
  },

  packagePrice: {
    color: `${Colors.gold.DEFAULT}`,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },

  buyButton: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },

  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: "center",
    marginLeft: 5
  },

  divider: {
    height: 1,
    backgroundColor: '#4e2a7f',
    marginVertical: 20,
  },

  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
  },

  glowWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    borderRadius: 16, // only works on iOS
  },
});
