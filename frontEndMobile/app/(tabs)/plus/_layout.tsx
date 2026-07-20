import { Stack } from 'expo-router';
export default function PlusLayout() {
  return (
    <Stack screenOptions={{ headerShown: false,}} >
      <Stack.Screen  name="index"/>
      <Stack.Screen name="profile-settings" options={{ title: 'Infos & réglages' }}/>
      <Stack.Screen name="devops-connections"options={{ title: 'Connexions DevOps' }} />
      <Stack.Screen name="github-repos" options={{ title: 'Repos GitHub suivis' }}/>
    </Stack>
  );
}