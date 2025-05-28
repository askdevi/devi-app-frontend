import { Redirect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export async function getUserID() {
  return await SecureStore.getItemAsync('userID');
}

export async function storeUserID() {
  await SecureStore.setItemAsync('userID', "I8wH0ApKA8M97pNNf6z88an7IXy1");
}

export async function clearUserID() {
  await SecureStore.deleteItemAsync('userID');
}

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      await clearUserID();
      const userID = await getUserID();
      await storeUserID();
      if (userID) {
        router.replace('/(tabs)');
      } else {
        // router.replace('/(auth)/phone');
        router.replace('/(auth)/setup/name');
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [router]);

  return null;
}