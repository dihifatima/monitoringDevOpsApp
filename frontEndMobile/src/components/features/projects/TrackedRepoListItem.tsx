// src/components/features/projects/TrackedRepoListItem.tsx
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import type { TrackedRepoResponse } from '@/src/services/githubReposService';

interface TrackedRepoListItemProps {
  repo: TrackedRepoResponse;
  onPress: () => void;
}

const TrackedRepoListItem: React.FC<TrackedRepoListItemProps> = ({ repo, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Ionicons name="logo-github" size={22} color={Colors.black} style={styles.icon} />

      <View style={styles.textBlock}>
        <AppText variant="body" bold numberOfLines={1}>
          {repo.fullName}
        </AppText>
        <AppText variant="small" style={styles.subtitle}>
          Suivi depuis le {new Date(repo.trackedAt).toLocaleDateString()}
        </AppText>
      </View>

      <Ionicons name="chevron-forward" size={20} color={Colors.GrisPerle} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Spacing.inputRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  icon: { marginRight: Spacing.sm },
  textBlock: { flex: 1, marginRight: Spacing.sm },
  subtitle: { opacity: 0.5, marginTop: 2 },
});

export default TrackedRepoListItem;