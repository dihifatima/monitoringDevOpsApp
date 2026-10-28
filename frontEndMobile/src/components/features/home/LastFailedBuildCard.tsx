import { View, Pressable, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import { timeAgo } from '@/src/utils/timeAgo';
import { openCommitDetailFromOutside } from '@/src/utils/openCommitDetail';
import type { ActivityItem } from '@/src/hooks/home/useRecentActivity';

// S'affiche seulement si le build le plus récent a échoué.
export default function LastFailedBuildCard({ activity }: { activity: ActivityItem[] }) {
  const latest = activity
    .filter((a) => a.buildResult || a.buildBuilding)
    .sort(
      (a, b) =>
        new Date(b.commitDate ?? 0).getTime() - new Date(a.commitDate ?? 0).getTime()
    )[0];

  if (!latest || latest.buildBuilding || latest.buildResult !== 'FAILURE') return null;

  return (
    <View style={styles.card}>
      <AppText variant="body" bold>
        Dernier build échoué
      </AppText>
      <AppText variant="small" color="#5A2B2B" style={styles.sub}>
        {latest.repoName}
        {latest.commitDate ? ` · ${timeAgo(latest.commitDate)}` : ''}
      </AppText>
      <Pressable
        style={styles.btn}
        accessibilityRole="button"
        onPress={() => {
          if (latest.commitSha) {
            openCommitDetailFromOutside(latest.repoId, latest.commitSha);
          }
        }}
      >
        <AppText variant="small" bold color="#fff">
          Voir le détail
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.rougeClaire,
    borderLeftWidth: 5,
    borderLeftColor: Colors.error,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sub: { fontSize: 13, marginTop: 2, marginBottom: 12 },
  btn: {
    alignSelf: 'flex-start',
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
