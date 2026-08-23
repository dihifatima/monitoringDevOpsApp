// src/components/layout/TabRootHeader.tsx
import React, { useState } from 'react';
import { View, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useAuthGlobal } from '@/src/context/AuthContext';
import NotificationsPreviewModal from '@/src/components/features/notifications/NotificationsPreviewModal';
import { useNotificationsGlobal } from '@/src/context/NotificationsContext';
interface TabRootHeaderProps {
  mode: 'greeting' | 'title';
  title?: string;        
  fullName?: string;    
  avatarUri?: string | null;
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
}) => {
  const { logout } = useAuthGlobal();
  const [notifModalVisible, setNotifModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => logout() },
      ]
    );
  };
const { unreadCount } = useNotificationsGlobal();
  return (
    <View style={styles.header}>
      {/* Avatar — cliquable, renvoie vers l'édition du profil */}
      <Pressable
        onPress={() => router.push('/(tabs)/plus/profile-settings')}
        hitSlop={8}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color={Colors.success} />
          </View>
        )}
      </Pressable>

      {/* Zone centrale  — greeting (Home) ou titre simple (autres tabs) */}
      <View style={styles.centerText}>
        {mode === 'greeting' ? (
          <>
            <AppText variant="small" style={styles.greeting}>
              {getGreeting()}
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
       <Pressable onPress={() => setNotifModalVisible(true)} hitSlop={8} style={styles.bellWrapper}>
  <Ionicons name="notifications-outline" size={22} color={Colors.black} />
  {unreadCount > 0 && <View style={styles.unreadBadge} />}
</Pressable>
        <Pressable onPress={handleLogout} hitSlop={8}>
          <Ionicons name="log-out-outline" size={22} color={Colors.black} />
        </Pressable>
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
    backgroundColor: Colors.greyLight
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  greeting: {
    opacity: 0.5,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bellWrapper: {
  position: 'relative',
},
unreadBadge: {
  position: 'absolute',
  top: -2,
  right: -2,
  width: 9,
  height: 9,
  borderRadius: 5,
  backgroundColor: '#E24C4C',
  borderWidth: 1.5,
  borderColor: Colors.greyLight,
},
});

export default TabRootHeader;