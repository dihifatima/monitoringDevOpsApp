import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

const STYLE_MAP: Record<string, { icon: string; iconColor: string; iconBg: string; badgeBg: string; label: string }> = {
  SUCCESS: { icon: 'checkmark', iconColor: '#2e8b3d', iconBg: '#dff3e1', badgeBg: '#dff3e1', label: 'SUCCESS' },
  FAILURE: { icon: 'close', iconColor: '#c62d2d', iconBg: '#fbe0e0', badgeBg: '#fbe0e0', label: 'FAILURE' },
  BUILDING: { icon: 'ellipse', iconColor: '#2b7de9', iconBg: '#dbe9fb', badgeBg: '#dbe9fb', label: 'EN COURS' },
};

type Props = {
  number: number;
  result: string | null;
  building: boolean;
  duration: number;
  timestamp: number;
  onPress: () => void;
};

export default function BuildRunRow({ number, result, building, duration, timestamp, onPress }: Props) {
  const key = building ? 'BUILDING' : result ?? 'BUILDING';
  const style = STYLE_MAP[key] ?? STYLE_MAP.BUILDING;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: style.iconBg }]}>
        <Ionicons name={style.icon as any} size={16} color={style.iconColor} />
      </View>
      <View style={styles.main}>
        <AppText variant="body" bold>
          Build #{number}
        </AppText>
      </View>
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: style.badgeBg }]}>
          <AppText variant="small" color={style.iconColor} bold>
            {style.label}
          </AppText>
        </View>
        <AppText variant="small" color={Colors.grey} style={{ marginTop: 4 }}>
          {building ? new Date(timestamp).toLocaleDateString() : `${Math.round(duration / 1000)}s · ${new Date(timestamp).toLocaleDateString()}`}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: { flex: 1 },
  right: { alignItems: 'flex-end' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
});