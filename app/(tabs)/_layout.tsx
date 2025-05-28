import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Chrome as Home, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.deepPurple.dark,
          borderTopColor: `${Colors.gold.DEFAULT}20`,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.gold.DEFAULT,
        tabBarInactiveTintColor: `${Colors.gold.DEFAULT}50`,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}