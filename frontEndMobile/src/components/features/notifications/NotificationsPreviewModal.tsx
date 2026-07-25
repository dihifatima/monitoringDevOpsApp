// src/components/features/notifications/NotificationsPreviewModal.tsx
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppModal from '@/src/components/common/AppModal';
import AppText from '@/src/components/common/AppText';
import AppButton from '@/src/components/common/AppButton';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

interface NotificationsPreviewModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationsPreviewModal: React.FC<NotificationsPreviewModalProps> = ({
  visible,
  onClose,
}) => {
  const handleSeeAll = () => {
    onClose();
    router.push('/(tabs)/notifications');
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

      {/* Placeholder en attendant le backend notifications */}
      <View style={styles.emptyState}>
        <Ionicons name="notifications-outline" size={32} color={Colors.GrisPerle} />
        <AppText variant="body" style={styles.emptyText}>
          Aucune notification pour l'instant
        </AppText>
      </View>

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