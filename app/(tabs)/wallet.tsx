import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wallet Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.deepPurple.DEFAULT,
  },
  text: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
});