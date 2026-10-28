import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

export default function ProjetsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="commit-detail" />
    </Stack>
  );
}
