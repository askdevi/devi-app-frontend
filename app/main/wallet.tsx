import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import BackgroundEffects from '@/components/BackgroundEffects';
import AsyncStorage from '@react-native-async-storage/async-storage';

const calculateDiscount = (originalPrice: number, price: number) => {
  const discount = Math.floor(((originalPrice - price) / originalPrice) * 100);
  return discount > 0 ? discount : null;
};

const timePlans = [
  {
    name: "10 Minutes Access",
    duration: "10 Minutes",
    originalPrice: 99,
    price: 99,
    // originalPrice: 1,
    // price: 1,
    get discount() { return calculateDiscount(this.originalPrice, this.price); }
  },
  {
    name: "Hourly Access",
    duration: "1 Hour",
    originalPrice: 299,
    price: 199,
    // originalPrice: 1,
    // price: 1,
    get discount() { return calculateDiscount(this.originalPrice, this.price); }
  },
  {
    name: "Daily Access",
    duration: "1 Day",
    originalPrice: 599,
    price: 299,
    // originalPrice: 1,
    // price: 1,
    get discount() { return calculateDiscount(this.originalPrice, this.price); }
  },
];

export default function WalletScreen() {
  const router = useRouter();

  const [time, setTime] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const tokens1 = await AsyncStorage.getItem('tokens');
      const timeEnd1 = await AsyncStorage.getItem('timeEnd');
      const currentTime = Date.now();
      if (tokens1 && timeEnd1) {
        const timeEndTimestamp = new Date(JSON.parse(timeEnd1)).getTime();
        setTime(Math.max(0, timeEndTimestamp - currentTime));
      }
    };
    loadData();
  }, []);

  const handleBack = () => {
    router.back();
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
          <ScrollView style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Balance Section */}
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceValue}>
                  {Math.floor(time / (1000 * 60 * 60))}h {Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))}m
                </Text>
                <Text style={styles.balanceLabel}>Remaining Time</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Time Packages */}
            <Text style={styles.packagesTitle}>Time Packages</Text>
            {timePlans.map((pkg, idx) => (
              <View key={idx} style={styles.packageCard}>
                {pkg.discount && (
                  <Text style={styles.discount}>{pkg.discount}% OFF</Text>
                )}
                <Text style={styles.packageLabel}>{pkg.duration}</Text>
                <Text style={styles.packageSub}>Unlimited Questions</Text>
                {pkg.discount && (
                  <Text style={styles.strikePrice}>₹{pkg.originalPrice}</Text>
                )}
                <Text style={styles.packagePrice}>₹{pkg.price}</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Buy Now</Text>
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
