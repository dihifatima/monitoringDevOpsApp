// src/components/layout/TabRootHeader.tsx
import React, { useState } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useAuthGlobal } from '@/src/context/AuthContext';
import NotificationsPreviewModal from '@/src/components/features/notifications/NotificationsPreviewModal';
import { useNotificationsGlobal } from '@/src/context/NotificationsContext';
import { confirmLogout } from '@/src/utils/confirmLogout';

interface TabRootHeaderProps {
  mode: 'greeting' | 'title';
  title?: string;
  fullName?: string;
  avatarUri?: string | null;
  backgroundColor?: string; // défaut : greyLight (les autres onglets ne changent pas)
  showLogout?: boolean; // défaut : true
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

const TabRootHeader: React.FC<TabRootHeaderProps> = ({
  mode,
  title,
  fullName,
  avatarUri,
  backgroundColor = Colors.greyLight,
  showLogout = true,
}) => {
  const { logout } = useAuthGlobal();
  const { unreadCount } = useNotificationsGlobal();
  const [notifModalVisible, setNotifModalVisible] = useState(false);

  return (
    <View style={[styles.header, { backgroundColor }]}>
      {/* Avatar — renvoie vers l'édition du profil */}
      <Pressable
        onPress={() => router.navigate('/(tabs)/plus/profile-settings')}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="Modifier mon profil"
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={22} color="#fff" />
          </View>
        )}
      </Pressable>

      {/* Zone centrale — greeting (Home) ou titre simple (autres tabs) */}
      <View style={styles.centerText}>
        {mode === 'greeting' ? (
          <>
            <AppText variant="small" color={Colors.textMuted} style={styles.greeting}>
              {getGreeting()},
            </AppText>
            <AppText variant="h3" bold numberOfLines={1}>
              {fullName}
            </AppText>
          </>
        ) : (
          <AppText variant="h3" bold>
            {title}
          </AppText>
        )}
      </View>

      {/* Actions à droite */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => setNotifModalVisible(true)}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel={
            unreadCount > 0 ? `Notifications, ${unreadCount} non lues` : 'Notifications'
          }
        >
          <Ionicons name="notifications-outline" size={24} color={Colors.black} />
          {unreadCount > 0 && <View style={[styles.unreadBadge, { borderColor: backgroundColor }]} />}
        </Pressable>

        {showLogout && (
          <Pressable
            onPress={() => confirmLogout(logout)}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Se déconnecter"
          >
            <Ionicons name="log-out-outline" size={24} color={Colors.black} />
          </Pressable>
        )}
      </View>

      <NotificationsPreviewModal
        visible={notifModalVisible}
        onClose={() => setNotifModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: { flex: 1, marginLeft: Spacing.sm },
  greeting: { marginBottom: 2 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  // zone tactile de 44 dp
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  unreadBadge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    borderWidth: 2,
  },
});

export default TabRootHeader;