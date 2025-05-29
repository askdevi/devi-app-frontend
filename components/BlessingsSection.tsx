import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import BlessingCard from './BlessingCard';

const BlessingsSection = ({ dailyBlessings }: { dailyBlessings: any }) => {

  const daily_blessings = JSON.parse(dailyBlessings);
  const blessings = [
    {
      title: 'LUCKY MANTRA',
      mantra: daily_blessings.luckyMantra.latinScript,
      sanskrit: daily_blessings.luckyMantra.sanskritScript,
      direction: daily_blessings.luckyMantra.direction,
    },
    {
      title: 'LUCKY COLOR',
      color: daily_blessings.luckyColor,
    },
    {
      title: 'LUCKY NUMBER',
      number: daily_blessings.luckyNumber,
    },
    {
      title: 'AUSPICIOUS TIME',
      time: daily_blessings.auspiciousTime,
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