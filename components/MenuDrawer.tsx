import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { X, MessageCircle, Wallet, User, History, Headphones, Settings, Clock, Coins } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';

interface MenuDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  phone?: string;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.85, 360);

export default function MenuDrawer({ isVisible, onClose }: MenuDrawerProps) {
  const router = useRouter();
  const [animation] = React.useState(new Animated.Value(0));
  const [phone, setPhone] = useState('+91 1234567890');
  const [firstName, setFirstName] = useState('User');
  const [time, setTime] = useState(0);

  const handleSettings = () => {
    router.push('/(tabs)/settings');
    onClose();
  };

  const handleWallet = () => {
    router.push('/(tabs)/wallet');
    onClose();
  };

  const handleProfile = () => {
    router.push('/(tabs)/profile');
    onClose();
  };

  const handleChat = () => {
    router.push('/(tabs)/devi');
    onClose();
  };

  const handleChatHistory = () => {
    router.push('/(tabs)/chat-history');
    onClose();
  };

  useEffect(() => {
    const loadData = async () => {
      let phone1 = await AsyncStorage.getItem('phoneNumber');
      const firstName1 = await AsyncStorage.getItem('firstName');
      const timeEnd1 = await AsyncStorage.getItem('timeEnd');
      const currentTime = Date.now();
      if (phone1 && firstName1 && timeEnd1) {
        phone1 = phone1.replace('+91', '+91 ');
        setPhone(phone1);
        setFirstName(firstName1);
        const timeEndTimestamp = new Date(JSON.parse(timeEnd1)).getTime();
        setTime(Math.max(0, timeEndTimestamp - currentTime));
      }
    };
    loadData();
  }, []);

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const MenuItem = ({ icon: Icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon size={24} color={Colors.white} strokeWidth={1.5} />
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <User size={24} color={Colors.gold.DEFAULT} />
            </View>
            <View>
              <Text style={styles.userName}>{firstName}</Text>
              <Text style={styles.userPhone}>{phone}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.gold.DEFAULT} />
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          {/* <View style={styles.statItem}>
            <Coins size={20} color={Colors.gold.DEFAULT} />
            <Text style={styles.statValue}>{tokens} tokens left</Text>
          </View> */}
          <View style={styles.statItem}>
            <Clock size={20} color={Colors.gold.DEFAULT} />
            <Text style={styles.statValue}>
              {Math.floor(time / (1000 * 60 * 60))}h {Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))}m left
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          <MenuItem icon={MessageCircle} label="Start Chat" onPress={handleChat} />
          <MenuItem icon={Wallet} label="Wallet" onPress={handleWallet} />
          <MenuItem icon={User} label="Edit Profile" onPress={handleProfile} />
          <MenuItem icon={History} label="Chat History" onPress={handleChatHistory} />
          <MenuItem icon={Headphones} label="Customer Support" />
          <MenuItem icon={Settings} label="Settings" onPress={handleSettings} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: Colors.deepPurple.DEFAULT,
    borderRightWidth: 1,
    borderRightColor: `${Colors.gold.DEFAULT}20`,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.gold.DEFAULT}20`,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.gold.DEFAULT}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  userPhone: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: `${Colors.white}80`,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.gold.DEFAULT}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.gold.DEFAULT}20`,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.gold.DEFAULT,
  },
  menu: {
    padding: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  menuItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.white,
  },
});