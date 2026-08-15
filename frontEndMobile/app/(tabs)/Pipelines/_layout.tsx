import { Stack } from 'expo-router';

export default function PipelinesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[repoId]/index" />
      <Stack.Screen name="[repoId]/[buildNumber]" />
    </Stack>
  );
}