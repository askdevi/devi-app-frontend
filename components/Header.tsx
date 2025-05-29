import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import MenuDrawer from './MenuDrawer';

const Header = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePress = (action: () => void) => {
    if (Platform.OS !== 'web') {
      // Add haptic feedback for mobile
    }
    action();
  };

  const handleProfilePress = () => {
    handlePress(() => router.push('/(tabs)/profile'));
  };

  return (
    <>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handlePress(() => setIsMenuOpen(true))}
          accessibilityLabel="Menu"
        >
          <Menu color={Colors.gold.DEFAULT} size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleProfilePress}
          accessibilityLabel="Account"
        >
          <User color={Colors.gold.DEFAULT} size={24} />
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
  }
});

export default Header;