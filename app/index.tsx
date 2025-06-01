import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUserId } from '@/constants/userId';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      // await setupFCM();
      await checkAuth();
    };

    init();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('New Notification', JSON.stringify(remoteMessage.notification?.title || 'FCM Message'));
    });

    return unsubscribe;
  }, [router]);

  const setupFCM = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      Alert.alert('FCM Token', token); // For testing
    } else {
      Alert.alert('Notification permission denied');
    }
  };

  const checkAuth = async () => {
    const userId = await getUserId();
    if (userId) {
      router.push('/main/loading');
    } else {
      router.push('/signup/phone');
    }
  };

  return null;
}
