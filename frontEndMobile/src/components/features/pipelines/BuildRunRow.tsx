import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

const STYLE_MAP: Record<string, { icon: string; iconColor: string; iconBg: string; badgeBg: string; label: string }> = {
  SUCCESS: { icon: 'checkmark', iconColor: Colors.success, iconBg: Colors.green, badgeBg: Colors.green, label: 'PASSED' },
  FAILURE: { icon: 'close', iconColor: Colors.buildFailed, iconBg: Colors.buildFailed, badgeBg: '#fbe0e0', label: 'FAILED' },
  BUILDING: { icon: 'play', iconColor: Colors.info, iconBg: Colors.info, badgeBg: '#dbe9fb', label: 'RUNNING' },
};

function timeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}j`;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(diffMs / (1000 * 60));
  return `${Math.max(minutes, 1)}min`;
}

type Props = {
  number: number;
  result: string | null;
  building: boolean;
  duration: number;
  timestamp: number;
  branch: string | null;
  triggeredBy: string | null;
  isLast?: boolean;
  onPress: () => void;
};

export default function BuildRunRow({
  number,
  result,
  building,
  duration,
  timestamp,
  branch,
  isLast,
  onPress,
}: Props) {
  const key = building ? 'BUILDING' : result ?? 'BUILDING';
  const style = STYLE_MAP[key] ?? STYLE_MAP.BUILDING;

  const shortBranch = branch ? branch.split('/').pop() : null;

  return (
    <Pressable style={[styles.row, !isLast && styles.rowBorder]} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: style.iconBg }]}>
        <Ionicons name={style.icon as any} size={16} color={style.iconColor} />
      </View>

      <View style={styles.main}>
        <AppText variant="body" bold>
          Build #{number}
        </AppText>
        <View style={styles.metaRow}>
          {shortBranch && (
            <View style={styles.branchBadge}>
              <Ionicons name="git-branch-outline" size={11} color={Colors.grey} />
              <AppText variant="small" color={Colors.grey} style={{ marginLeft: 3 }}>
                {shortBranch}
              </AppText>
            </View>
          )}
          {!building && (
            <AppText variant="small" color={Colors.grey} style={{ marginLeft: shortBranch ? 8 : 0 }}>
              {Math.round(duration / 1000)}s
            </AppText>
          )}
        </View>
      </View>

      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: style.badgeBg }]}>
          <AppText variant="small" color={style.iconColor} bold>
            {style.label}
          </AppText>
        </View>
        <AppText variant="small" color={Colors.grey} style={{ marginTop: 6 }}>
          {timeAgo(timestamp)}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  branchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greyLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  right: { alignItems: 'flex-end' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
});