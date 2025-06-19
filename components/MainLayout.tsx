import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Hero from './Hero';
import BlessingsSection from './BlessingsSection';
import BackgroundEffects from './BackgroundEffects';
import Footer from './Footer';
import CompatibilitySection from './CompatibilitySection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FreeTimePopup from './Popups/FreeTimePopup';
import * as amplitude from '@amplitude/analytics-react-native';

const MainLayout = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (showPopup) {
        amplitude.track('Popup: Closed Free Time', { screen: 'Home' });
        setShowPopup(false);
        return true;
      }
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const startedFreeMinutes1 = await AsyncStorage.getItem('startedFreeMinutes');
      const popupShown = await AsyncStorage.getItem('popupShown');
      const startedFreeMinutesInt = parseInt(startedFreeMinutes1 || '1');
      if (startedFreeMinutesInt === 0) {
        if (popupShown === 'false') {
          await AsyncStorage.setItem('popupShown', 'true');
          setShowPopup(true);
          amplitude.track('Popup: Opened Free Time', { screen: 'Home' });
        }
        else {
          if (Math.random() < 0.5) {
            setShowPopup(true);
            amplitude.track('Popup: Opened Free Time', { screen: 'Home' });
          }
        }
      }
    };
    loadData();
  }, []);

  return (
    <SafeAreaProvider>
      {showPopup && <FreeTimePopup onClose={() => {
        amplitude.track('Popup: Closed Free Time', { screen: 'Home' });
        setShowPopup(false);
      }} />}
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
        <View
          style={styles.container} >
          <BackgroundEffects count={30} />

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
    backgroundColor: "hsl(274, 100%, 10%)",
  },
  container: {
    flex: 1,
    backgroundColor: "hsl(274, 100%, 10%)",
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