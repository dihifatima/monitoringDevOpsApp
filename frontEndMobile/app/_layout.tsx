import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAppFonts } from '@/src/hooks/useAppFonts';
import { AuthProvider } from '@/src/context/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NotificationsProvider } from '@/src/context/NotificationsContext';

import { PushNotificationsManager } from '@/src/components/features/notifications/PushNotificationsManager';
import ServerSleepingBanner from '@/src/components/features/Serversleepingbanner';

// Le splash reste affiché jusqu'à ce que AuthContext ait lu la session
// (SplashScreen.hideAsync() est appelé dans AuthContext.tsx).
SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  webClientId: '208058372543-6aiocvhvtaibeplc32ulp9mj8rglsskq.apps.googleusercontent.com',
  offlineAccess: false,
});

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NotificationsProvider>
        <PushNotificationsManager />
        <ServerSleepingBanner />

        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="objective" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(oauth)" options={{ headerShown: false }} />
        </Stack>
      </NotificationsProvider>
    </AuthProvider>
  );
}