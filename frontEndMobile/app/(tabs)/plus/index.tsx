// app/(tabs)/plus/index.tsx
import { ScrollView, StyleSheet } from 'react-native';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppMenuListItem from '@/src/components/common/AppMenuListItem';
import AppMenuSection from '@/src/components/common/AppMenuSection';
import { moreMenuItems } from '@/src/constants/menuConfig';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

export default function MoreScreen() {
  return (
    <ScreenContainer
      backgroundColor={Colors.white}
      withTabBar
      header={<ScreenHeader title="Plus" showBack={true} />}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppMenuSection>
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.lg },
});