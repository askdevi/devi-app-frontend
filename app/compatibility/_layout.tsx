import { Stack } from 'expo-router';

export default function AppLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="compatibility-main" />
            <Stack.Screen name="compatibility-form" />
            <Stack.Screen name="compatibility-report" />
        </Stack>
    );
}