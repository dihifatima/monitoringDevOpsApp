import React from 'react';
import { ScrollView, Pressable, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { NOTIFICATION_FILTERS } from '@/src/constants/notificationTypes';

interface NotificationFilterTabsProps {
  active: string;
  onChange: (key: string) => void;
}

const NotificationFilterTabs: React.FC<NotificationFilterTabsProps> = ({ active, onChange }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
    {NOTIFICATION_FILTERS.map((filter) => {
      const isActive = filter.key === active;
      return (
        <Pressable
          key={filter.key}
          onPress={() => onChange(filter.key)}
          style={[styles.tab, isActive && styles.tabActive]}
        >
          <AppText style={isActive ? styles.tabTextActive : styles.tabText}>{filter.label}</AppText>
        </Pressable>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { gap: Spacing.sm, paddingVertical: Spacing.sm },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.white,
  },
  tabActive: { backgroundColor: Colors.black, borderColor: Colors.black },
  tabText: { color: Colors.black },
  tabTextActive: { color: Colors.white },
});

export default NotificationFilterTabs;