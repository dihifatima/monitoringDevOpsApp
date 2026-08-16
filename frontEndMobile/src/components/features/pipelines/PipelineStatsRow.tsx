import { View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Spacing from '@/src/styles/spacing';

type Props = { success: number; failure: number };

export default function PipelineStatsRow({ success, failure }: Props) {
  const total = success + failure;
  const rate = total > 0 ? Math.round((success / total) * 100) : 0;

  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: '#dff3e1' }]}>
        <AppText variant="h2" bold color="#2e8b3d">{success}</AppText>
        <AppText variant="small" color="#2e8b3d">Succès</AppText>
      </View>
      <View style={[styles.card, { backgroundColor: '#fbe0e0' }]}>
        <AppText variant="h2" bold color="#c62d2d">{failure}</AppText>
        <AppText variant="small" color="#c62d2d">Échecs</AppText>
      </View>
      <View style={[styles.card, { backgroundColor: '#dbe9fb' }]}>
        <AppText variant="h2" bold color="#2b7de9">{rate}%</AppText>
        <AppText variant="small" color="#2b7de9">Taux OK</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  card: { flex: 1, borderRadius: 14, padding: Spacing.sm, alignItems: 'flex-start' },
});