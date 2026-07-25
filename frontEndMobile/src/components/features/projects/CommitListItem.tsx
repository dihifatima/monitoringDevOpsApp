// src/components/features/projects/CommitListItem.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import type { CommitSummary } from '@/src/services/githubReposService';

interface CommitListItemProps {
  commit: CommitSummary;
}

const CommitListItem: React.FC<CommitListItemProps> = ({ commit }) => {
  return (
    <View style={styles.row}>
      {commit.authorAvatarUrl ? (
        <Image source={{ uri: commit.authorAvatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}

      <View style={styles.textBlock}>
        <AppText variant="body" numberOfLines={2}>
          {commit.message}
        </AppText>
        <AppText variant="small" style={styles.meta}>
          {commit.authorLogin || commit.authorName} · {new Date(commit.date).toLocaleDateString()}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: Spacing.sm },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: Spacing.sm,
  },
  textBlock: { flex: 1 },
  meta: { opacity: 0.5, marginTop: 2 },
});

export default CommitListItem;