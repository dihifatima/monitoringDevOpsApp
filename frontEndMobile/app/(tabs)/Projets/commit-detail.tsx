import { View, Linking, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useRepoDetail } from '@/src/hooks/Oauth_github/useRepoDetail';
import { useCommitMeasures } from '@/src/hooks/Oauth_sonarqube/useCommitMeasures';

const METRIC_LABELS: Record<string, string> = {
  bugs: 'Bugs',
  vulnerabilities: 'Vulnérabilités',
  code_smells: 'Code smells',
  coverage: 'Couverture',
  duplicated_lines_density: 'Duplication',
  ncloc: 'Lignes de code',
};

const PERCENT_METRICS = new Set(['coverage', 'duplicated_lines_density']);

export default function CommitDetailScreen() {
  const { repoId, sha } = useLocalSearchParams<{ repoId: string; sha: string }>();

  const {
    isLoading: reposLoading,
    selectedRepo: trackedRepo,
    commits,
  } = useRepoDetail(repoId);

  const { analysisByRevision, isLoading: measuresLoading } = useCommitMeasures(
    trackedRepo?.id ?? 0,
    trackedRepo?.sonarProjectKey ?? null
  );

  if (reposLoading) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        withTabBar
        scrollable
        header={<ScreenHeader title="Commit" />}
      >
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.black} />
        </View>
      </ScreenContainer>
    );
  }

  const commit = commits.find((c) => c.sha === sha);

  if (!commit) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        withTabBar
        scrollable
        header={<ScreenHeader title="Commit" />}
      >
        <View style={styles.centered}>
          <AppText variant="body" style={styles.emptyText}>
            Commit introuvable
          </AppText>
        </View>
      </ScreenContainer>
    );
  }

  const analysis = analysisByRevision.get(sha);

  return (
    <ScreenContainer
      backgroundColor={Colors.greyLight}
      withTabBar
      scrollable
      header={<ScreenHeader title="Détail du commit" />}
    >
      <View style={styles.card}>
        <AppText variant="body" bold>
          {commit.message}
        </AppText>
        <AppText variant="small" style={styles.meta}>
          {commit.authorLogin || commit.authorName} · {new Date(commit.date).toLocaleString()}
        </AppText>

        <Pressable onPress={() => Linking.openURL(commit.url)} style={styles.linkRow}>
          <Ionicons name="link-outline" size={16} color={Colors.accent ?? Colors.black} />
          <AppText variant="small" color={Colors.accent} style={styles.linkText}>
            Voir le commit sur GitHub
          </AppText>
        </Pressable>

        <AppText variant="small" style={styles.sha}>
          {sha}
        </AppText>
      </View>

      <AppText variant="body" bold style={styles.sectionTitle}>
        Qualité du code
      </AppText>

      {measuresLoading ? (
        <ActivityIndicator color={Colors.black} />
      ) : !analysis ? (
        <View style={styles.card}>
          <AppText variant="small" style={styles.emptyText}>
            Ce commit n'a pas encore été analysé par SonarQube.
          </AppText>
        </View>
      ) : (
        <View style={styles.card}>
          <AppText variant="small" style={styles.analysisDate}>
            Analysé le {new Date(analysis.date).toLocaleString()}
          </AppText>
          <View style={styles.grid}>
            {analysis.measures.map((measure) => {
              const label = METRIC_LABELS[measure.metric] ?? measure.metric;
              const suffix = PERCENT_METRICS.has(measure.metric) ? '%' : '';
              return (
                <View key={measure.metric} style={styles.cell}>
                  <AppText variant="h3" bold>
                    {measure.value}
                    {suffix}
                  </AppText>
                  <AppText variant="small" color={Colors.grey} style={styles.cellLabel}>
                    {label}
                  </AppText>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  meta: { opacity: 0.5, marginTop: 4 },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: 4 },
  linkText: { textDecorationLine: 'underline' },
  sha: { opacity: 0.4, marginTop: Spacing.xs, fontFamily: 'monospace' as any },
  sectionTitle: { marginBottom: Spacing.sm },
  analysisDate: { opacity: 0.5, marginBottom: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '33%', alignItems: 'center', marginBottom: Spacing.md },
  cellLabel: { textAlign: 'center', marginTop: 2 },
  emptyText: { opacity: 0.5 },
});