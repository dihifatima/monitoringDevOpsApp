import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { Notification } from '@/src/services/notificationsService';
import { NOTIFICATION_TYPE_CONFIG } from '@/src/constants/notificationTypes';
import { getNotificationTitle, formatRelativeTime } from '@/src/utils/notificationFormat';

interface NotificationCardProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
  const config = NOTIFICATION_TYPE_CONFIG[notification.type as keyof typeof NOTIFICATION_TYPE_CONFIG] ?? {
    label: notification.type,
    icon: 'notifications-outline' as const,
    color: Colors.black,
  };

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(notification)}>
      <View style={styles.iconWrapper}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      <View style={styles.textWrapper}>
        <AppText bold numberOfLines={1} style={styles.title}>
          {getNotificationTitle(notification)}
        </AppText>
        <AppText numberOfLines={2} style={styles.message}>
          {notification.message}
        </AppText>
        <AppText variant="small" style={styles.time}>
          {formatRelativeTime(notification.createdAt)}
        </AppText>
      </View>

      {!notification.read && <View style={styles.unreadDot} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.greyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  textWrapper: { flex: 1 },
  title: { marginBottom: 2 },
  message: { opacity: 0.7, marginBottom: 4 },
  time: { opacity: 0.5 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7CF6',
    marginLeft: Spacing.sm,
    marginTop: 4,
  },
});

export default NotificationCard;