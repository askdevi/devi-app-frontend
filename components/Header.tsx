import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, User, Coins, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import MenuDrawer from './MenuDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [startedFreeMinutes, setStartedFreeMinutes] = useState(1);

  const handlePress = (action: () => void) => {
    if (Platform.OS !== 'web') {
      // Add haptic feedback for mobile
    }
    action();
  };

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
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  const handleTimePress = () => {
    handlePress(() => router.push('/main/wallet' as any));
  };

  return (
    <>
      {/* <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}> */}
      <View style={[styles.header, { paddingTop: 28 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handlePress(() => setIsMenuOpen(true))}
          accessibilityLabel="Menu"
        >
          <Menu color={Colors.gold.DEFAULT} size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton1}
          onPress={handleTimePress}
          accessibilityLabel="Account"
        >
          <Text style={styles.coinText}>
            {startedFreeMinutes === 0 ? '00:03' : time > 0 ? `${String(Math.floor(time / (1000 * 60 * 60))).padStart(2, '0')}:${String(Math.ceil((time % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')}` : '00:00'}
          </Text>
          <Clock color={Colors.gold.DEFAULT} size={20} />
        </TouchableOpacity>
      </View>

      <MenuDrawer
        isVisible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 17, 82, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  coinText: {
    color: Colors.gold.DEFAULT,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  iconButton1: {
    // width: 40,
    // height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  }

});

export default Header;