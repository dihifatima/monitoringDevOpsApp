import { View, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

type Props = { builds: { number: number; result: string | null }[] };

// Approximatif : 1 point par build (succès=haut, échec=bas), pas de vraie agrégation hebdo
export default function BuildTrendChart({ builds }: Props) {
  if (builds.length < 2) return null;

  const sorted = [...builds].sort((a, b) => a.number - b.number).slice(-8);
  const width = 280;
  const height = 70;
  const stepX = width / (sorted.length - 1);

  const points = sorted.map((b, i) => {
    const y = b.result === 'SUCCESS' ? height * 0.15 : height * 0.85;
    return { x: i * stepX, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.card}>
      <AppText variant="small" bold color={Colors.grey} style={{ marginBottom: Spacing.sm }}>
        Taux de succès (approximatif)
      </AppText>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polyline points={polylinePoints} fill="none" stroke="#2e8b3d" strokeWidth={2.5} />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3} fill="#2e8b3d" />
        ))}
      </Svg>
      <View style={styles.labelsRow}>
        <AppText variant="small" color={Colors.grey}>Build #{sorted[0].number}</AppText>
        <AppText variant="small" color={Colors.grey}>Build #{sorted[sorted.length - 1].number}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
});