// import { Stack } from 'expo-router';

// export default function AuthLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="phone" />
//       <Stack.Screen name="otp" />
//     </Stack>
//   );
// }

import { Slot } from 'expo-router';

export default function SignupLayout() {
  return <Slot />;
}