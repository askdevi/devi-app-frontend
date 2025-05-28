import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Hero from './Hero';
import BlessingsSection from './BlessingsSection';
import BackgroundEffects from './BackgroundEffects';
import Footer from './Footer';
import Colors from '@/constants/Colors';

const MainLayout = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
        <View style={styles.container}>
          <BackgroundEffects />
          
          <Header />
          
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Hero />
            <BlessingsSection />
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
    backgroundColor: Colors.deepPurple.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  bottomPadding: {
    height: 100, // Space for footer
  },
});

export default MainLayout;