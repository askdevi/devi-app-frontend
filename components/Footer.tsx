import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Animated } from 'react-native';
import { Chrome as Home, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

const Footer = () => {
  const shineAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    const shineAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    shineAnimation.start();

    return () => {
      shineAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['transparent', `${Colors.gold.DEFAULT}10`]}
        style={styles.gradientBg}
      />
      
      <View style={styles.nav}>
        <Pressable style={styles.navButton}>
          <Home size={22} color={Colors.white} strokeWidth={1.5} />
          <Text style={styles.navText}>Home</Text>
        </Pressable>

        <Pressable style={styles.askButtonContainer}>
          <LinearGradient
            colors={Colors.gradients.goldPrimary}
            style={styles.askButton}
          >
            <Text style={styles.omText}>ॐ</Text>
            <Animated.View 
              style={[
                styles.shine,
                {
                  transform: [{
                    translateX: shineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-80, 80]
                    })
                  }]
                }
              ]}
            />
          </LinearGradient>
          <Text style={styles.askText}>Ask</Text>
        </Pressable>

        <Pressable style={styles.navButton} onPress={() => router.push('/(tabs)/profile')}>
          <User size={22} color={Colors.white} strokeWidth={1.5} />
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.deepPurple.dark,
    borderTopWidth: 1,
    borderTopColor: `${Colors.gold.DEFAULT}20`,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  nav: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Poppins-Medium',
  },
  askButtonContainer: {
    alignItems: 'center',
    marginTop: -30,
  },
  askButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: Colors.gold.DEFAULT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  omText: {
    fontSize: 24,
    color: Colors.deepPurple.DEFAULT,
    fontFamily: 'Poppins-Bold',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-25deg' }],
    borderRadius: 60,
  },
  askText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Poppins-Medium',
  },
});

export default Footer;