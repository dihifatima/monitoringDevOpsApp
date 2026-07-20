import { Tabs } from 'expo-router';
import CustomTabBar from '@/src/components/navigation/CustomTabBar';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home"  />
      <Tabs.Screen name="Projets"  />
      <Tabs.Screen name="notifications"  />
      <Tabs.Screen name="Pipelines"  />
      <Tabs.Screen name="plus"  />
    </Tabs>
  );
}