// src/components/features/projects/TrackedRepoListItem.tsx
import React from 'react';
import { View,Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import type { TrackedRepoResponse } from '@/src/services/githubReposService';

interface TrackedRepoListItemProps {
  repo: TrackedRepoResponse;
  onPress: () => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Java: '#B07219',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Python: '#3572A5',
  HTML: '#E34C26',
  CSS: '#563D7C',
};

function getLanguageColor(language: string | null): string {
  if (!language) return Colors.greyLight;
  return LANGUAGE_COLORS[language] ?? Colors.accent;
}

function timeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "à l'instant";
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffJ = Math.floor(diffH / 24);
  return `il y a ${diffJ}j`;
}

function splitOwnerRepo(fullName: string): { owner: string; repo: string } {
  const [owner, repo] = fullName.split('/');
  return { owner: owner ?? '', repo: repo ?? fullName };
}

const TrackedRepoListItem: React.FC<TrackedRepoListItemProps> = ({ repo, onPress }) => {
  const { owner, repo: repoName } = splitOwnerRepo(repo.fullName);

  return (
    <Pressable onPress={onPress} style={styles.card}>
    <View style={styles.headerRow}>
  <Ionicons name="logo-github" size={20} color={Colors.black} style={styles.icon} />
  <AppText variant="body" numberOfLines={1} style={styles.headerText}>
    <AppText variant="body">{owner}/</AppText>
    <AppText variant="body" bold>{repoName}</AppText>
  </AppText>
  <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
</View>

      <View style={styles.metaRow}>
        {repo.language && (
          <View style={styles.metaItem}>
            <View style={[styles.languageDot, { backgroundColor: getLanguageColor(repo.language) }]} />
            <AppText variant="small" style={styles.metaText}>{repo.language}</AppText>
          </View>
        )}
        {repo.default_branch && (
          <View style={styles.metaItem}>
            <Ionicons name="git-branch-outline" size={13} color={Colors.accent} />
            <AppText variant="small" style={styles.metaText}>{repo.default_branch}</AppText>
          </View>
        )}
        <AppText variant="small" style={styles.metaText}>
          suivi depuis le {new Date(repo.trackedAt).toLocaleDateString()}
        </AppText>
      </View>

      {repo.lastCommitMessage && (
        <View style={styles.commitCard}>
           <Image source={{ uri: repo.lastCommitAuthorAvatarUrl ?? undefined }} style={styles.commitAvatar} />          <View style={styles.commitTextBlock}>
            <AppText variant="small" numberOfLines={1} style={styles.commitMessage}>
              {repo.lastCommitMessage}
            </AppText>
            <AppText variant="small" style={styles.commitAuthor}>
              {repo.lastCommitAuthorLogin ?? repo.lastCommitAuthorName} · {timeAgo(repo.lastCommitDate)}
            </AppText>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.inputRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { marginRight: Spacing.sm },
  headerText: { flex: 1 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: Spacing.md + 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaText: { opacity: 0.55 },
  commitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greyLight,
    borderRadius: Spacing.inputRadius,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  commitAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3C9D5C',
    marginRight: Spacing.sm,
  },
  commitTextBlock: { flex: 1 },
  commitMessage: { fontWeight: '500' },
  commitAuthor: { opacity: 0.5, marginTop: 2 },
});

export default TrackedRepoListItem;