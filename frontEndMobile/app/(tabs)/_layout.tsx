// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import CustomTabBar from '@/src/components/navigation/CustomTabBar';
import { TabBarHeightProvider } from '@/src/context/TabBarHeightContext';
import { ConnectorsProvider } from '@/src/context/ConnectorsContext';

export const unstable_settings = {
  anchor: 'home',
};

export default function TabLayout() {
  return (
    <ConnectorsProvider>
      <TabBarHeightProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            popToTopOnBlur: true,
          }}
          tabBar={(props) => <CustomTabBar {...props} />}
        >
          <Tabs.Screen name="home" options={{ popToTopOnBlur: true }} />
          <Tabs.Screen name="Projets" options={{ popToTopOnBlur: true }} />
          <Tabs.Screen name="notifications" options={{ popToTopOnBlur: true }} />
          <Tabs.Screen name="Pipelines" options={{ popToTopOnBlur: true }} />
          <Tabs.Screen name="plus" options={{ popToTopOnBlur: true }} />
        </Tabs>
      </TabBarHeightProvider>
    </ConnectorsProvider>
  );
}
