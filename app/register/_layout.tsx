// import { Stack } from 'expo-router';

// export default function SetupLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="name" />
//       <Stack.Screen name="gender" />
//       <Stack.Screen name="birth-details" />
//       <Stack.Screen name="birth-place" />
//       <Stack.Screen name="personal-details" />
//     </Stack>
//   );
// }

import { Slot } from 'expo-router';

export default function RegisterLayout() {
  return <Slot />;
}