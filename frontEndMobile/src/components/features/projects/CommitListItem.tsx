// src/components/features/projects/CommitListItem.tsx
import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import type { CommitSummary } from '@/src/services/githubReposService';
import type { CommitMeasureEntry } from '@/src/services/sonarQubeService';

interface CommitListItemProps {
  commit: CommitSummary;
  measures?: CommitMeasureEntry[];
  onPressDetail: () => void;
}

const COMPACT_METRICS: { key: string; label: string; isPercent?: boolean }[] = [
  { key: 'bugs', label: 'Bugs' },
  { key: 'code_smells', label: 'Smells' },
  { key: 'coverage', label: 'Coverage', isPercent: true },
];

const CommitListItem: React.FC<CommitListItemProps> = ({ commit, measures, onPressDetail }) => {
  const findValue = (metricKey: string) =>
    measures?.find((m) => m.metric === metricKey)?.value;

  return (
    <Pressable style={styles.row} onPress={onPressDetail}>
      <View style={styles.mainRow}>
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

        <Ionicons name="chevron-forward" size={18} color={Colors.grey} />
      </View>

      {measures && measures.length > 0 && (
        <View style={styles.metricsGrid}>
          {COMPACT_METRICS.map(({ key, label, isPercent }) => {
            const value = findValue(key);
            if (value === undefined) return null;

            return (
              <View key={key} style={styles.metricCell}>
                <AppText variant="small" bold>
                  {value}
                  {isPercent ? '%' : ''}
                </AppText>
                <AppText variant="small" color={Colors.grey}>
                  {label}
                </AppText>
              </View>
            );
          })}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.sm ,
    borderBottomWidth: 2,
    borderBottomColor: Colors.green,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: Spacing.sm },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.greyLight,
    marginRight: Spacing.sm,
  },
  textBlock: { flex: 1 },
  meta: { opacity: 0.5, marginTop: 2 },
  metricsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    marginLeft: 42,
  },
  metricCell: {
    backgroundColor: Colors.greyLight,
    borderRadius: Spacing.borderRadius,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    minWidth: 60,
  },
});

export default CommitListItem;