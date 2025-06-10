// import { Stack } from 'expo-router';

// export default function TabsLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="home" />
//       <Stack.Screen name="profile" />
//       <Stack.Screen name="edit-profile" />
//       <Stack.Screen name="wallet" />
//       <Stack.Screen name="settings" />
//       <Stack.Screen name="chat-history" />
//       <Stack.Screen name="chat-history-detail" />
//       <Stack.Screen name="devi" />
//       <Stack.Screen name="support" />
//     </Stack>
//   );
// }

import { Slot } from 'expo-router';

export default function MainLayout() {
  return <Slot />;
}