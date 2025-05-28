import { Redirect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export async function getUserID() {
  return await SecureStore.getItemAsync('userID');
}

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const userID = await getUserID();
      if (userID) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/phone');
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [router]);

  return null;
}