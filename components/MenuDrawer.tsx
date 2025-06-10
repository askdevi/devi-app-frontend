import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { X, MessageCircle, Wallet, User, History, Headphones, Settings, Clock, Phone, CircleUser } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface MenuDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  phone?: string;
}

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.7, 280);

export default function MenuDrawer({ isVisible, onClose }: MenuDrawerProps) {
  const router = useRouter();
  const [animation] = React.useState(new Animated.Value(0));
  const [shouldRender, setShouldRender] = useState(false);
  const [phone, setPhone] = useState('+91 1234567890');
  const [firstName, setFirstName] = useState('User');
  const [time, setTime] = useState(0);
  const [startedFreeMinutes, setStartedFreeMinutes] = useState(1);

  const handleSettings = () => {
    router.push('/main/settings');
    onClose();
  };

  const handleWallet = () => {
    router.push('/main/wallet');
    onClose();
  };

  const handleProfile = () => {
    router.push('/main/edit-profile');
    onClose();
  };

  const handleChat = () => {
    router.push('/main/devi');
    onClose();
  };

  const handleChatHistory = () => {
    router.push('/main/chat-history');
    onClose();
  };

  const handleSupport = () => {
    router.push('/main/support');
    onClose();
  };

  useEffect(() => {
    const loadData = async () => {
      let phone1 = await AsyncStorage.getItem('phoneNumber');
      const firstName1 = await AsyncStorage.getItem('firstName');
      const timeEnd1 = await AsyncStorage.getItem('timeEnd');
      const startedFreeMinutes1 = await AsyncStorage.getItem('startedFreeMinutes');
      const startedFreeMinutesInt = parseInt(startedFreeMinutes1 || '1');
      const currentTime = Date.now();
      if (phone1 && firstName1 && timeEnd1) {
        phone1 = phone1.replace('+91', '+91 ');
        setPhone(phone1);
        setFirstName(firstName1);
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

  React.useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [isVisible]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const MenuItem = ({ icon: Icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon size={18} color="#e5e7eb" strokeWidth={1.5} />
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  if (!shouldRender && !isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['#150829', '#1D0A37', '#000000']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.drawer}
        >
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <CircleUser size={28} color={Colors.gold.DEFAULT} strokeWidth={1.5} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{firstName}</Text>
                <View style={styles.phoneContainer}>
                  <Phone size={10} color="#9ca3af" strokeWidth={1.5} />
                  <Text style={styles.userPhone}>{phone}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={Colors.gold.DEFAULT + '80'} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.stats}>
            {/* <View style={styles.statItem}>
              <Coins size={20} color={Colors.gold.DEFAULT} />
              <Text style={styles.statValue}>{tokens} tokens left</Text>
            </View> */}
            <View style={styles.statItem}>
              <Clock size={16} color={Colors.gold.DEFAULT} strokeWidth={1.5} />
              <Text style={styles.statValue}>
                {startedFreeMinutes === 0 ? '00:03' : time > 0 ? `${String(Math.floor(time / (1000 * 60 * 60))).padStart(2, '0')}:${String(Math.ceil((time % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')}` : '00:00'}
              </Text>
            </View>
          </View>

          <View style={styles.menu}>
            <MenuItem icon={MessageCircle} label="Start Chat" onPress={handleChat} />
            <MenuItem icon={Wallet} label="Wallet" onPress={handleWallet} />
            <MenuItem icon={CircleUser} label="Edit Profile" onPress={handleProfile} />
            <MenuItem icon={History} label="Chat History" onPress={handleChatHistory} />
            <MenuItem icon={Headphones} label="Support" onPress={handleSupport} />
            <MenuItem icon={Settings} label="Settings" onPress={handleSettings} />
          </View>
        </LinearGradient>
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
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: height,
    zIndex: 200,
  },
  drawer: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.gold.DEFAULT}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.gold.DEFAULT,
    marginBottom: 2,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPhone: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
  closeButton: {
    padding: 8,
  },
  stats: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(147, 51, 234, 0.3)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(29, 10, 55, 0.3)',
    backgroundColor: 'rgba(50, 20, 90, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  statValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.gold.DEFAULT,
  },
  menu: {
    paddingHorizontal: 12,
    paddingTop: 8,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  menuItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#e5e7eb',
  },
});