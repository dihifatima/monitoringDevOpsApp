// src/components/features/notifications/NotificationsPreviewModal.tsx
import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppModal from '@/src/components/common/AppModal';
import AppText from '@/src/components/common/AppText';
import AppButton from '@/src/components/common/AppButton';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { getNotifications, markNotificationAsRead, Notification } from '@/src/services/notificationsService';
import NotificationCard from '@/src/components/features/notifications/NotificationCard';
import { resolveNotificationRoute } from '@/src/utils/resolveNotificationRoute';
import { useNotificationsGlobal } from '@/src/context/NotificationsContext';
interface NotificationsPreviewModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationsPreviewModal: React.FC<NotificationsPreviewModalProps> = ({
  visible,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { refreshUnreadCount } = useNotificationsGlobal();

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getNotifications()
      .then((data) => setNotifications(data.slice(0, 3))) // backend renvoie déjà trié par createdAt desc
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [visible]);

  const handleSeeAll = () => {
    onClose();
    router.push('/(tabs)/notifications');
  };

const handlePress = (notification: Notification) => {
  if (!notification.read) {
    markNotificationAsRead(notification.id)
      .then(refreshUnreadCount)
      .catch(() => {});
  }
    onClose();

    const route = resolveNotificationRoute({
      type: notification.type,
      trackedRepoId: notification.trackedRepo?.id,
      commitsha: notification.commitsha ?? undefined,
    });

    if (route) router.push(route as any);
  };

  return (
    <AppModal visible={visible} onClose={onClose} backgroundColor={Colors.white}>
      <View style={styles.headerRow}>
        <AppText variant="h3" bold>
          Notifications
        </AppText>
        <Pressable onPress={onClose} hitSlop={8}>
          <Ionicons name="close" size={22} color={Colors.black} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.black} style={styles.loader} />
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-outline" size={32} color={Colors.greyLight} />
          <AppText variant="body" style={styles.emptyText}>
            Aucune notification pour l'instant
          </AppText>
        </View>
      ) : (
        <View style={styles.list}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={handlePress}
            />
          ))}
        </View>
      )}

      <AppButton label="Voir tout" onPress={handleSeeAll} variant="text" />
    </AppModal>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  list: {
    marginBottom: Spacing.sm,
  },
  loader: {
    marginVertical: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  emptyText: {
    marginTop: Spacing.sm,
    opacity: 0.5,
  },
});

export default NotificationsPreviewModal;