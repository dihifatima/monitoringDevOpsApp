// src/components/features/projects/SonarMeasuresCard.tsx
import { View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';
import type { SonarQubeMeasuresResponse } from '@/src/services/sonarQubeMeasuresService';

type SonarMeasuresCardProps = {
  data: SonarQubeMeasuresResponse;
};

const METRIC_LABELS: Record<string, string> = {
  bugs: 'Bugs',
  vulnerabilities: 'Vulnérabilités',
  code_smells: 'Code smells',
  coverage: 'Couverture',
  duplicated_lines_density: 'Duplication',
  ncloc: 'Lignes de code',
};

const PERCENT_METRICS = new Set(['coverage', 'duplicated_lines_density']);

export default function SonarMeasuresCard({ data }: SonarMeasuresCardProps) {
  const measures = data.component.measures;

  return (
    <View style={styles.grid}>
      {measures.map((measure) => {
        const label = METRIC_LABELS[measure.metric] ?? measure.metric;
        const suffix = PERCENT_METRICS.has(measure.metric) ? '%' : '';

        return (
          <View key={measure.metric} style={styles.cell}>
            <AppText variant="h3" bold>
              {measure.value}
              {suffix}
            </AppText>
            <AppText variant="small" style={styles.label}>
              {label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
  },
  cell: {
    width: '33%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    opacity: 0.5,
    marginTop: 2,
    textAlign: 'center',
  },
});