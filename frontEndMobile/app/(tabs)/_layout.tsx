import { Tabs } from 'expo-router';
import CustomTabBar from '@/src/components/navigation/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="Projets" options={{ title: 'Projets' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alertes' }} />
      <Tabs.Screen name="Pipelines" options={{ title: 'Pipelines' }} />
      <Tabs.Screen name="plus" options={{ title: 'Plus' }} />
    </Tabs>
  );
}