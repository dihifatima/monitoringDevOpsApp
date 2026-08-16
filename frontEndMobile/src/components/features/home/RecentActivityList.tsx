import { View, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import type { ActivityItem } from '@/src/hooks/useRecentActivity';

const STATUS_ICON: Record<string, { name: string; color: string }> = {
  SUCCESS: { name: 'checkmark-circle', color: '#3d6b1f' },
  FAILURE: { name: 'close-circle', color: '#a13a3a' },
};

export default function RecentActivityList({ activity }: { activity: ActivityItem[] }) {
  if (activity.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppText variant="body" bold style={styles.title}>
        Activité récente
      </AppText>

      {activity.map((item) => {
        const statusIcon = item.buildBuilding
          ? { name: 'sync', color: '#8a6200' }
          : item.buildResult
          ? STATUS_ICON[item.buildResult]
          : null;

        return (
          <Pressable
            key={`${item.repoId}-${item.commitSha}`}
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: '/Projets/commit-detail',
                params: { repoId: String(item.repoId), sha: item.commitSha ?? '' },
              })
            }
          >
            <View style={styles.rowLeft}>
              <AppText variant="small" bold color={Colors.grey}>
                {item.repoName}
              </AppText>
              <AppText variant="body" numberOfLines={1} style={{ marginTop: 2 }}>
                {item.commitMessage ?? 'Sans message'}
              </AppText>
              <AppText variant="small" color={Colors.grey} style={{ marginTop: 2 }}>
                {item.commitDate ? new Date(item.commitDate).toLocaleString() : ''}
              </AppText>
            </View>
            {statusIcon && (
              <Ionicons name={statusIcon.name as any} size={22} color={statusIcon.color} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: { marginBottom: Spacing.sm },
  row: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: { flex: 1, marginRight: Spacing.sm },
});