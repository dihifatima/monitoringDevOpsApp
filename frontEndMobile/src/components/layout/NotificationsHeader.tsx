import React from 'react';
import { View, Image, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

interface NotificationsHeaderProps {
  fullName?: string;
  avatarUri?: string | null;
  searchValue: string;
  onSearchChange: (text: string) => void;
}

const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  fullName,
  avatarUri,
  searchValue,
  onSearchChange,
}) => {
  const initial = fullName?.trim()?.[0]?.toUpperCase() ?? '?';

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.push('/(tabs)/plus/profile-settings')}
        hitSlop={8}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <AppText bold style={styles.avatarInitial}>{initial}</AppText>
          </View>
        )}
      </Pressable>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Colors.black} style={styles.searchIcon} />
        <TextInput
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder="Rechercher"
          placeholderTextColor="#9AA0A6"
          style={styles.searchInput}
        />
      </View>

      <Pressable
        onPress={() => router.push('/(tabs)/plus/notifications-settings')}
        hitSlop={8}
      >
        <Ionicons name="settings-outline" size={22} color={Colors.black} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCE9FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#2E7CF6',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greyLight,
    borderRadius: 20,
    paddingHorizontal: Spacing.sm,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
    padding: 0,
  },
});

export default NotificationsHeader;