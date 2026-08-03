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
import { useCommitDetail } from '@/src/hooks/Oauth_github/useCommitDetail';

const METRIC_LABELS: Record<string, string> = {
  bugs: 'Bugs',
  vulnerabilities: 'Vulnérabilités',
  code_smells: 'Code smells',
  coverage: 'Couverture',
  duplicated_lines_density: 'Duplication',
  ncloc: 'Lignes de code',
};

const PERCENT_METRICS = new Set(['coverage', 'duplicated_lines_density']);

const FILE_STATUS_LABELS: Record<string, string> = {
  added: 'Ajouté',
  modified: 'Modifié',
  removed: 'Supprimé',
  renamed: 'Renommé',
};

const FILE_STATUS_COLORS: Record<string, string> = {
  added: '#3E8E4F',
  modified: '#6E6E68',
  removed: '#C0392B',
  renamed: '#4A90D9',
};

export default function CommitDetailScreen() {
  const { repoId, sha } = useLocalSearchParams<{ repoId: string; sha: string }>();

  const {
    isLoading: reposLoading,
    selectedRepo: trackedRepo,
    commits,
  } = useRepoDetail(repoId);

  // fullName ressemble à "dihifatima/monitoringDevOpsApp" → owner/repo pour l'API GitHub
  const [owner, repo] = trackedRepo?.fullName?.split('/') ?? [undefined, undefined];

  const {
    commitDetail,
    isLoading: detailLoading,
    error: detailError,
  } = useCommitDetail(owner, repo, sha);

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

      {/* ↓ NOUVEAU : stats globales (additions/deletions/fichiers) */}
      {detailLoading ? (
        <ActivityIndicator color={Colors.black} style={{ marginBottom: Spacing.lg }} />
      ) : detailError ? (
        <AppText variant="small" style={[styles.emptyText, { marginBottom: Spacing.lg }]}>
          {detailError}
        </AppText>
      ) : commitDetail ? (
        <>
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <AppText variant="h3" bold color="#3E8E4F">
                +{commitDetail.totalAdditions ?? 0}
              </AppText>
              <AppText variant="small" color={Colors.grey}>
                Ajouts
              </AppText>
            </View>
            <View style={styles.statPill}>
              <AppText variant="h3" bold color="#C0392B">
                −{commitDetail.totalDeletions ?? 0}
              </AppText>
              <AppText variant="small" color={Colors.grey}>
                Suppressions
              </AppText>
            </View>
            <View style={styles.statPill}>
              <AppText variant="h3" bold>
                {commitDetail.files?.length ?? 0}
              </AppText>
              <AppText variant="small" color={Colors.grey}>
                Fichiers
              </AppText>
            </View>
          </View>

          {/* ↓ NOUVEAU : liste des fichiers modifiés */}
          {commitDetail.files && commitDetail.files.length > 0 && (
            <>
              <AppText variant="body" bold style={styles.sectionTitle}>
                Fichiers modifiés
              </AppText>
              <View style={styles.card}>
                {commitDetail.files.map((file, index) => (
                  <View
                    key={file.filename}
                    style={[
                      styles.fileRow,
                      index < commitDetail.files.length - 1 && styles.fileRowBorder,
                    ]}
                  >
                    <View style={styles.fileInfo}>
                      <AppText variant="small" numberOfLines={1} style={styles.filename}>
                        {file.filename}
                      </AppText>
                      <View style={styles.fileMetaRow}>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: (FILE_STATUS_COLORS[file.status] ?? Colors.grey) + '22' },
                          ]}
                        >
                          <AppText
                            variant="small"
                            color={FILE_STATUS_COLORS[file.status] ?? Colors.grey}
                            style={styles.statusText}
                          >
                            {FILE_STATUS_LABELS[file.status] ?? file.status}
                          </AppText>
                        </View>
                        <AppText variant="small" color="#3E8E4F" style={styles.fileStat}>
                          +{file.additions}
                        </AppText>
                        <AppText variant="small" color="#C0392B" style={styles.fileStat}>
                          −{file.deletions}
                        </AppText>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </>
      ) : null}

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

  // ↓ NOUVEAU
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statPill: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  fileRow: {
    paddingVertical: Spacing.sm,
  },
  fileRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  fileInfo: { flex: 1 },
  filename: { fontFamily: 'monospace' as any },
  fileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: { fontWeight: '700' as any },
  fileStat: { fontWeight: '600' as any },
});