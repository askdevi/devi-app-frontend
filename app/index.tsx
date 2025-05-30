import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUserId } from '@/constants/userId';



export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      // await clearUserId();
      const userId = await getUserId();
      if (userId) {
        router.push('/main/loading');
      } else {
        router.push('/signup/phone');
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [router]);

  return null;
}