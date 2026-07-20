// app/(tabs)/plus/index.tsx
import {  ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppMenuListItem from '@/src/components/common/AppMenuListItem';
import AppMenuSection from '@/src/components/common/AppMenuSection';
import { moreMenuItems } from '@/src/constants/menuConfig';
import Colors from '@/src/constants/colors';
export default function MoreScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>

        <AppMenuSection >
          {moreMenuItems.map((item) => (
            <AppMenuListItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              route={item.route}
            />
          ))}
        </AppMenuSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: 20
  },
  content: {
    padding: 20,
  }
});