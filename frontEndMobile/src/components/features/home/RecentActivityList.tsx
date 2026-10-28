import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { timeAgo } from '@/src/utils/timeAgo';
import { openCommitDetailFromOutside } from '@/src/utils/openCommitDetail';
import type { ActivityItem } from '@/src/hooks/home/useRecentActivity';

const STATUS_UI = {
  SUCCESS: { icon: 'checkmark', color: Colors.success, bg: Colors.okClaire },
  FAILURE: { icon: 'close', color: '#A63D3D', bg: Colors.rougeClaire },
  RUNNING: { icon: 'sync', color: '#1D4FB3', bg: Colors.bleuClaire },
  NONE: { icon: 'git-commit-outline', color: Colors.textMuted, bg: Colors.greyLight },
} as const;

function statusOf(item: ActivityItem) {
  if (item.buildBuilding) return STATUS_UI.RUNNING;
  if (item.buildResult === 'SUCCESS') return STATUS_UI.SUCCESS;
  if (item.buildResult === 'FAILURE') return STATUS_UI.FAILURE;
  return STATUS_UI.NONE;
}

export default function RecentActivityList({ activity }: { activity: ActivityItem[] }) {
  return (
    <View style={styles.container}>
      <AppText variant="body" bold style={styles.title}>
        Activité récente
      </AppText>

      {activity.length === 0 ? (
        <View style={styles.empty}>
          <AppText variant="small" color={Colors.textMuted} style={{ textAlign: 'center' }}>
            Rien pour l'instant.{'\n'}Vos commits apparaîtront ici dès le premier dépôt suivi.
          </AppText>
        </View>
      ) : (
        activity.map((item) => {
          const ui = statusOf(item);
          const message =
            item.commitMessage?.trim() && item.commitMessage.trim() !== '...'
              ? item.commitMessage.trim()
              : 'Commit sans message';

          return (
            <Pressable
              key={`${item.repoId}-${item.commitSha}`}
              style={styles.row}
              accessibilityRole="button"
              onPress={() => {
                if (item.commitSha) {
                  openCommitDetailFromOutside(item.repoId, item.commitSha);
                }
              }}
            >
              <View style={[styles.icon, { backgroundColor: ui.bg }]}>
                <Ionicons name={ui.icon as any} size={18} color={ui.color} />
              </View>

              <View style={styles.rowLeft}>
                <AppText variant="body" bold numberOfLines={1} style={styles.repo}>
                  {item.repoName}
                </AppText>
                <AppText
                  variant="small"
                  color={Colors.textMuted}
                  numberOfLines={1}
                  style={styles.msg}
                >
                  {message}
                </AppText>
              </View>

              {!!item.commitDate && (
                <AppText variant="small" color={Colors.textMuted} style={styles.date}>
                  {timeAgo(item.commitDate)}
                </AppText>
              )}
              <Ionicons name="chevron-forward" size={16} color={Colors.grey} />
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: { marginBottom: Spacing.xs },
  // pas de fond carte : séparateurs fins, comme l'écran Pipelines
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.greyLight,
  },
  icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowLeft: { flex: 1 },
  repo: { fontSize: 14 },
  msg: { fontSize: 13, marginTop: 2 },
  date: { fontSize: 12 },
  empty: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.grey,
    borderRadius: 16,
    padding: 20,
  },
});
