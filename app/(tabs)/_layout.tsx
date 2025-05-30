import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="loading" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="chat-history" />
      {/* <Stack.Screen name="devi" /> */}
    </Stack>
  );
}