// src/hooks/Oauth_sonarqube/useDismissedSonarBanner.ts
import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY_PREFIX = 'sonar_banner_dismissed_';

export function useDismissedSonarBanner(repoId: number) {
  const [isDismissed, setIsDismissed] = useState(false);

  const key = `${STORAGE_KEY_PREFIX}${repoId}`;

  useEffect(() => {
    let isMounted = true;

    SecureStore.getItemAsync(key).then((value) => {
      if (isMounted && value === 'true') {
        setIsDismissed(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [key]);

  const dismiss = useCallback(async () => {
    await SecureStore.setItemAsync(key, 'true');
    setIsDismissed(true);
  }, [key]);

  return { isDismissed, dismiss };
}