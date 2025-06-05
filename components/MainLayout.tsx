import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Hero from './Hero';
import BlessingsSection from './BlessingsSection';
import BackgroundEffects from './BackgroundEffects';
import Footer from './Footer';
import Colors from '@/constants/Colors';
import CompatibilitySection from './CompatibilitySection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FreeTimePopup from './Popups/FreeTimePopup';

const MainLayout = () => {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      const startedFreeMinutes1 = await AsyncStorage.getItem('startedFreeMinutes');
      const startedFreeMinutesInt = parseInt(startedFreeMinutes1 || '1');
      if (startedFreeMinutesInt === 0) {
        setShowPopup(true);
      }
    };
    loadData();
  }, []);
  return (
    <SafeAreaProvider>
      {showPopup && <FreeTimePopup onClose={() => setShowPopup(false)} />}
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
        <View
          style={styles.container} >
          <BackgroundEffects count={45} />

          <Header />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Hero />
            <BlessingsSection />
            <CompatibilitySection />
            <View style={styles.bottomPadding} />
          </ScrollView>

          <Footer />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.deepPurple.DEFAULT,
  },
  container: {
    flex: 1,
    // backgroundColor: Colors.deepPurple.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    // paddingBottom: 40,
  },
  bottomPadding: {
    height: 100,
  },
});

export default MainLayout;