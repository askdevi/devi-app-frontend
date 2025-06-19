import { Slot, usePathname, useGlobalSearchParams } from 'expo-router';
import * as amplitude from '@amplitude/analytics-react-native';
import { useEffect } from 'react';

export default function SignupLayout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    const screenName = pathname.split('/')[2];
    amplitude.track(`Screen Viewed: ${screenName}`, {
      screen: screenName,
      params: params,
    });
  }, [pathname, params]);

  return <Slot />;
}
