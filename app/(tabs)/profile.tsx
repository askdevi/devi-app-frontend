import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AccountSetup from '@/components/AccountSetup';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <AccountSetup /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});