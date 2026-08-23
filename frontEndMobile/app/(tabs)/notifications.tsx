import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { useNotifications } from '@/src/hooks/notifications/useNotifications';
import NotificationCard from '@/src/components/features/notifications/NotificationCard';
import NotificationFilterTabs from '@/src/components/features/notifications/NotificationFilterTabs';
import NotificationsHeader from '@/src/components/layout/NotificationsHeader';
import { Notification } from '@/src/services/notificationsService';
import { getNotificationTitle } from '@/src/utils/notificationFormat';
import { resolveNotificationRoute } from '@/src/utils/resolveNotificationRoute';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const { user } = useAuthGlobal();
  const { notifications, loading, refreshing, error, onRefresh, markAsRead } = useNotifications();
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredNotifications = useMemo(() => {
    let result = notifications;

    if (filter !== 'ALL') {
      result = result.filter((n) => n.type === filter);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (n) =>
          getNotificationTitle(n).toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    return result;
  }, [notifications, filter, search]);

  const header = (
    <NotificationsHeader
      fullName={user?.fullName}
      avatarUri={user?.profilePicture}
      searchValue={search}
      onSearchChange={setSearch}
    />
  );

const handlePress = (notification: Notification) => {
  if (!notification.read) markAsRead(notification.id);

  const route = resolveNotificationRoute({
    type: notification.type,
    trackedRepoId: notification.trackedRepo?.id,
    commitsha: notification.commitsha ?? undefined,
  });

  if (route) {
    router.push(route as any);
  }
};

  return (
    <ScreenContainer backgroundColor={Colors.greyLight} withTabBar header={header}>
      <NotificationFilterTabs active={filter} onChange={setFilter} />

      {error && <AppText style={styles.errorText}>{error}</AppText>}

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NotificationCard notification={item} onPress={handlePress} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <AppText style={styles.emptyText}>Aucune notification pour le moment</AppText>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  errorText: { color: 'red', textAlign: 'center', marginVertical: Spacing.sm },
  emptyState: { alignItems: 'center', marginTop: Spacing.xl },
  emptyText: { opacity: 0.5 },
});