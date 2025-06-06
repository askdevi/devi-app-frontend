// index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUserId } from '@/constants/userId';
import messaging from '@react-native-firebase/messaging';
import { Platform, Alert, Linking } from 'react-native';

// ✚ import from react-native-permissions
import {
  checkNotifications,
  requestNotifications,
  openSettings,
} from 'react-native-permissions';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await setupFCM();
      await checkAuth();
    };

    init();

    // Foreground handler: suppress system notification
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('🔥 Foreground FCM:', remoteMessage.notification);
      // You can show a custom in-app banner here if you want.
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  const setupFCM = async () => {
    //
    // 1. First, inspect the OS‐level “notification” status via react-native-permissions
    //
    let { status: currentStatus } = await checkNotifications();
    //
    // status can be 'unavailable' | 'denied' | 'blocked' | 'granted' | 'provisional'
    //
    if (currentStatus === 'blocked' || currentStatus === 'denied') {
      // The user has explicitly turned OFF all notifications from Settings (or never granted).
      // Prompt them to open Settings so they can manually re-enable:
      return Alert.alert(
        'Notifications Disabled',
        'To receive updates, please enable Notifications in your Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => openSettings().catch(() => Linking.openSettings()),
          },
        ]
      );
    }

    // 2. If we have neither 'granted' nor 'provisional', explicitly request:
    if (currentStatus !== 'granted' && currentStatus !== 'provisional') {
      const { status: newStatus } = await requestNotifications([
        'alert',
        'sound',
        'badge',
      ]);

      if (newStatus === 'blocked' || newStatus === 'denied') {
        // User still denied or blocked—send them to Settings:
        return Alert.alert(
          'Notifications Denied',
          'We need Notification permission to keep you updated. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => openSettings().catch(() => Linking.openSettings()),
            },
          ]
        );
      }
      // If they granted or are merely provisional, fall through...
    }

    //
    // 3. At this point, we know OS‐level notifications are “allowed”
    //    → now register for FCM and get the token
    //
    try {
      const fcmToken = await messaging().getToken();
      console.log('✅ FCM Token:', fcmToken);
    } catch (err) {
      console.warn('❌ Could not get FCM token:', err);
    }

    //
    // 4. (Android only) ensure background messages are handled
    //
    if (Platform.OS === 'android') {
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('🕒 Background FCM:', remoteMessage.notification);
        // No need to manually show a system notification here—if your payload
        // had a `notification:{…}` field, Android will automatically post it into the tray.
      });
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
