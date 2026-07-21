// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import CustomTabBar from '@/src/components/navigation/CustomTabBar';
import { TabBarHeightProvider } from '@/src/context/TabBarHeightContext';

export default function TabLayout() {
  return (
    <TabBarHeightProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="Projets" />
        <Tabs.Screen name="notifications" />
        <Tabs.Screen name="Pipelines" />
        <Tabs.Screen name="plus" />
      </Tabs>
    </TabBarHeightProvider>
  );
}