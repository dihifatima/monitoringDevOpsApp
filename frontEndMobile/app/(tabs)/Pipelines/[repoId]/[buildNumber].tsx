import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useBuildDetail } from '@/src/hooks/Oauth_jenkins/useBuildDetail';
import { useTestSummary } from '@/src/hooks/Oauth_jenkins/useTestSummary';
import { Ionicons } from '@expo/vector-icons';

const STATUS_STYLE: Record<string, { bg: string; text: string; pillBg: string }> = {
  SUCCESS: { bg: Colors.info, text: Colors.black, pillBg: Colors.green },
  FAILURE: { bg: Colors.grey, text: Colors.black, pillBg: Colors.buildFailed },
};

export default function BuildDetailScreen() {
  const { repoId, buildNumber } = useLocalSearchParams<{ repoId: string; buildNumber: string }>();
  const { build, isLoading, error } = useBuildDetail(Number(repoId), Number(buildNumber));
  const { summary: testSummary, isLoading: testsLoading } = useTestSummary(Number(repoId), Number(buildNumber));

  return (
    <ScreenContainer
      backgroundColor={Colors.greyLight}
      withTabBar
      scrollable
      header={<ScreenHeader title={`Build #${buildNumber}`} />}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.black} style={{ marginTop: 10 }} />
      ) : error || !build ? (
        <AppText variant="small" style={styles.emptyText}>
          {error ?? 'Build introuvable'}
        </AppText>
      ) : (
        <View style={styles.content}>
          {/* Bloc principal coloré */}
          <View
            style={[
              styles.headerBlock,
              { backgroundColor: STATUS_STYLE[build.result ?? '']?.bg ?? '#e4e5e2' },
            ]}
          >
            <View style={styles.headerTop}>
              <AppText variant="h4" bold>
                Build #{build.number}
              </AppText>
              {build.result && (
                <View
                  style={[
                    styles.pill,
                    { backgroundColor: STATUS_STYLE[build.result]?.pillBg ?? '#d9dbd6' },
                  ]}
                >
                  <AppText variant="small" bold>
                    {build.result}
                  </AppText>
                </View>
              )}
            </View>

            <View style={styles.grid}>
              {build.branch && (
                <View style={styles.gridItem}>
                  <AppText variant="small" color={Colors.black}>Branch</AppText>
                  <AppText variant="small" bold style={{ marginTop: 2 }}>
                    {build.branch.split('/').pop()}
                  </AppText>
                </View>
              )}
              <View style={styles.gridItem}>
                <AppText variant="small" color={Colors.black}>Duration</AppText>
                <AppText variant="small" bold style={{ marginTop: 2 }}>
                  {build.building ? 'En cours' : `${Math.round(build.duration / 1000)}s`}
                </AppText>
              </View>
              <View style={styles.gridItem}>
                <AppText variant="small" color={Colors.black}>Started</AppText>
                <AppText variant="small" bold style={{ marginTop: 2 }}>
                  {new Date(build.timestamp).toLocaleString()}
                </AppText>
              </View>
              {!build.building && (
                <View style={styles.gridItem}>
                  <AppText variant="small" color={Colors.black}>Finished</AppText>
                  <AppText variant="small" bold style={{ marginTop: 2 }}>
                    {new Date(build.timestamp + build.duration).toLocaleString()}
                  </AppText>
                </View>
              )}
            </View>

            {build.triggeredBy && (
              <View style={styles.triggeredBox}>
                <AppText variant="small" color={Colors.black}>Triggered by</AppText>
                <AppText variant="small" bold style={{ marginTop: 2 }}>
                  {build.triggeredBy}
                </AppText>
              </View>
            )}
          </View>

          {/* Section Tests (en premier) */}
          {!testsLoading && testSummary && (
            <View style={{ marginBottom: Spacing.lg }}>
              <AppText variant="body" bold style={styles.sectionTitle}>
                Test Results
              </AppText>
              <View style={styles.section}>
                <View style={styles.testHeaderRow}>
                  <AppText variant="body" bold>
                    Unit Tests
                  </AppText>
                  <AppText
                    variant="small"
  
                    color={testSummary.failCount > 0 ? Colors.error : Colors.success}
                  >
                    {testSummary.totalCount > 0
                      ? `${Math.round((testSummary.passCount / testSummary.totalCount) * 100)}%`
                      : '—'}
                  </AppText>
                </View>

                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width:
                          testSummary.totalCount > 0
                            ? `${(testSummary.passCount / testSummary.totalCount) * 100}%`
                            : '0%',
                        backgroundColor: testSummary.failCount > 0 ? Colors.error : Colors.success,
                      },
                    ]}
                  />
                </View>

                <View style={styles.testStatsRow}>
                  <View style={styles.testStatItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <AppText variant="small" style={{ marginLeft: 4 }}>
                      {testSummary.passCount} passed
                    </AppText>
                  </View>
                  {testSummary.failCount > 0 && (
                    <View style={styles.testStatItem}>
                      <Ionicons name="close-circle" size={16} olor={Colors.error} />
                      <AppText variant="small" style={{ marginLeft: 4 }}>
                        {testSummary.failCount} failed
                      </AppText>
                    </View>
                  )}
                  <AppText variant="small" color={Colors.grey}>
                    Total: {testSummary.totalCount}
                  </AppText>
                </View>
              </View>
            </View>
          )}

          {/* Section Commits (en second) */}
          <AppText variant="body" bold style={styles.sectionTitle}>
            Commits inclus
          </AppText>
          {!build.changeSets || build.changeSets.every((cs) => cs.items.length === 0) ? (
            <View style={styles.section}>
              <AppText variant="small" style={styles.emptyText}>
                Aucun commit associé à ce build.
              </AppText>
            </View>
          ) : (
            <View style={styles.section}>
              {build.changeSets.flatMap((cs, csIndex) =>
                cs.items.map((item, index) => (
                  <View
                    key={item.commitId}
                    style={[
                      styles.commitRow,
                      (csIndex > 0 || index > 0) && styles.commitRowBorder,
                    ]}
                  >
                    <AppText variant="small" bold numberOfLines={2}>
                      {item.msg}
                    </AppText>
                    <AppText variant="small" color={Colors.grey} style={styles.sha}>
                      {item.commitId}
                    </AppText>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.xs },
  headerBlock: {
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  gridItem: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 10,
  },
  triggeredBox: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  sectionTitle: { marginBottom: Spacing.xs },
  section: {
    backgroundColor: Colors.whiteLight,
    borderRadius: 14,
    padding: Spacing.xs,
  },
  commitRow: { paddingVertical: Spacing.sm },
  commitRowBorder: { borderTopWidth: 1, borderTopColor: '#d9dbd6' },
  sha: { fontFamily: 'monospace' as any, marginTop: 4 },
  emptyText: { opacity: 0.5 },
  testHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d9dbd6',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  testStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  testStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});