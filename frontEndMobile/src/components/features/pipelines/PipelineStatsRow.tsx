import { View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Spacing from '@/src/styles/spacing';
import Colors from '@/src/constants/colors';

type Props = { success: number; failure: number };

export default function PipelineStatsRow({ success, failure }: Props) {
  const total = success + failure;
  const rate = total > 0 ? Math.round((success / total) * 100) : 0;

  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: Colors.green }]}>
        <AppText variant="h4" bold color={Colors.buildSuccess}>{success}</AppText>
        <AppText variant="small" color={Colors.buildSuccess}>Succès</AppText>
      </View>
      <View style={[styles.card, { backgroundColor: Colors.rougeClaire }]}>
        <AppText variant="h4" bold color={Colors.buildFailed}>{failure}</AppText>
        <AppText variant="small" color={Colors.buildFailed}>Échecs</AppText>
      </View>
      <View style={[styles.card, { backgroundColor: Colors.bleuClaire }]}>
        <AppText variant="h4" bold color={Colors.info}>{rate}%</AppText>
        <AppText variant="small" color={Colors.info}>Taux OK</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  card: { flex: 1, borderRadius: 14, padding: Spacing.xs, alignItems: 'center' },
});