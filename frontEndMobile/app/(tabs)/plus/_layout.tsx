import { Stack } from 'expo-router';
import { ConnectorsProvider } from '@/src/context/ConnectorsContext';

export default function PlusLayout() {
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="profile-settings" options={{ title: 'Infos & réglages' }} />
        <Stack.Screen name="devops-connections-settings" options={{ title: 'Connexions DevOps' }} />
        <Stack.Screen name="github-repos-settings" options={{ title: 'Repos GitHub suivis' }} />
        <Stack.Screen name="notifications-settings" options={{ title: 'Notifications ' }} />
        <Stack.Screen name="password-settings" options={{ title: 'mot de passe' }} />
      </Stack>
  );
}