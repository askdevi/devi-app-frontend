import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import BlessingCard from './BlessingCard';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BlessingsSection = () => {

  const [dailyBlessings, setDailyBlessings] = useState({
    luckyMantra: {
      latinScript: '',
      sanskritScript: '',
      direction: '',
    },
    luckyColor: '',
    luckyNumber: '',
    auspiciousTime: '',
  });

  useEffect(() => {
    const fetchDailyBlessings = async () => {
      const dailyBlessings = await AsyncStorage.getItem('dailyBlessings');
      setDailyBlessings(JSON.parse(dailyBlessings || '{}'));
    };
    fetchDailyBlessings();
  }, []);

  const blessings = [
    {
      title: 'LUCKY MANTRA',
      mantra: dailyBlessings.luckyMantra.latinScript,
      sanskrit: dailyBlessings.luckyMantra.sanskritScript,
      direction: dailyBlessings.luckyMantra.direction,
    },
    {
      title: 'LUCKY COLOR',
      color: dailyBlessings.luckyColor,
    },
    {
      title: 'LUCKY NUMBER',
      number: dailyBlessings.luckyNumber,
    },
    {
      title: 'AUSPICIOUS TIME',
      time: dailyBlessings.auspiciousTime,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${Colors.deepPurple.light}20`, `${Colors.deepPurple.DEFAULT}10`]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Daily Blessings</Text>
          <Text style={styles.subtitle}>Tap to reveal your destiny</Text>
        </View>

        <ScrollView
          style={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {blessings.map((blessing, index) => (
            <BlessingCard
              key={index}
              data={blessing}
              delay={index * 0.15}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 20,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: `${Colors.gold.DEFAULT}10`,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.gold.DEFAULT,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.white,
    opacity: 0.7,
    textAlign: 'center',
  },
  cardsContainer: {
    marginTop: 10,
  },
});

export default BlessingsSection;