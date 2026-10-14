import { View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

// null / undefined => "—" (donnée indisponible, ce n'est pas un vrai 0)
type Props = {
  totalRepos?: number | null;
  success?: number | null;
  failure?: number | null;
  building?: number | null;
};

type StatProps = {
  label: string;
  value?: number | null;
  dotColor: string;
  valueColor?: string;
};

function Stat({ label, value, dotColor, valueColor }: StatProps) {
  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <AppText variant="small" color={Colors.textMuted} style={styles.label}>
          {label}
        </AppText>
      </View>
      <AppText variant="h4" bold color={valueColor ?? Colors.black} style={styles.value}>
        {value ?? '—'}
      </AppText>
    </View>
  );
}

export default function HomeStatsRow({ totalRepos, success, failure, building }: Props) {
  return (
    <View style={styles.grid}>
      <Stat label="Repos suivis" value={totalRepos} dotColor={Colors.grey} />
      <Stat label="Builds OK" value={success} dotColor={Colors.buildSuccess} />
      <Stat
        label="Échoués"
        value={failure}
        dotColor={Colors.buildFailed}
        valueColor={failure ? Colors.buildFailed : undefined} // rouge seulement si > 0
      />
      <Stat label="En cours" value={building} dotColor={Colors.buildRunning} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: Spacing.lg,
  },
  card: {
    width: '48%',
    height: 88,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12 },
  value: { fontSize: 28, lineHeight: 32 },
});