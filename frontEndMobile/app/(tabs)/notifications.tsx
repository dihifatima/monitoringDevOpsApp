import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { useNotifications } from '@/src/hooks/notifications/useNotifications';
import NotificationCard from '@/src/components/features/notifications/NotificationCard';
import NotificationsHeader from '@/src/components/layout/NotificationsHeader';
import { Notification } from '@/src/services/notificationsService';
import { getNotificationTitle } from '@/src/utils/notificationFormat';
import { resolveNotificationRoute } from '@/src/utils/resolveNotificationRoute';
import { openCommitDetailFromOutside } from '@/src/utils/openCommitDetail';

export default function NotificationsScreen() {
  const { user } = useAuthGlobal();
  const { notifications, loading, refreshing, error, onRefresh, markAsRead } = useNotifications();
  const [search, setSearch] = useState('');

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notifications;
    return notifications.filter(
      (n) =>
        getNotificationTitle(n).toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
    );
  }, [notifications, search]);

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
      openCommitDetailFromOutside(route.repoId, route.sha);
    }
  };

  return (
    <ScreenContainer backgroundColor={Colors.greyLight} withTabBar header={header}>
      {error && <AppText style={styles.errorText}>{error}</AppText>}

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NotificationCard notification={item} onPress={handlePress} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <AppText style={styles.emptyText}>
                {search.trim()
                  ? 'Aucun résultat pour cette recherche'
                  : 'Aucune notification pour le moment'}
              </AppText>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // paddingBottom élevé :  la barre d'onglets flottante ne doit pas masquer la dernière carte
  listContent: { paddingTop: Spacing.md, paddingBottom: 120, flexGrow: 1 },
  separator: { height: Spacing.sm },
  errorText: { color: Colors.error, textAlign: 'center', marginVertical: Spacing.sm },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl },
  emptyText: { opacity: 0.5, textAlign: 'center' },
});