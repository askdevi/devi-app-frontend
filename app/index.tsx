import { Redirect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export async function getUserId() {
  return await SecureStore.getItemAsync('userId');
}

export async function clearUserId() {
  await SecureStore.deleteItemAsync('userId');
}

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      // await clearUserId();
      const userId = await getUserId();
      if (userId) {
        router.push('/(tabs)/loading');
      } else {
        router.push('/(auth)/phone');
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [router]);

  return null;
}