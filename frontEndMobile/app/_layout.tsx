import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAppFonts } from '@/src/hooks/useAppFonts';
import { AuthProvider } from '@/src/context/AuthContext'; 
import { GoogleSignin } from '@react-native-google-signin/google-signin'; 

SplashScreen.preventAutoHideAsync();
GoogleSignin.configure({
  webClientId: '829349118406-pobgcs0joeg3jsv75itr31bsa8kf4er0.apps.googleusercontent.com',
  offlineAccess: false,
});
export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="objective" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}