import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useBuildDetail } from '@/src/hooks/Oauth_jenkins/useBuildDetail';

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  SUCCESS: { bg: '#a9e06c', text: '#3d6b1f' },
  FAILURE: { bg: '#f5c6c6', text: '#a13a3a' },
};

export default function BuildDetailScreen() {
  const { repoId, buildNumber } = useLocalSearchParams<{ repoId: string; buildNumber: string }>();
  const { build, isLoading, error } = useBuildDetail(Number(repoId), Number(buildNumber));

  return (
    <ScreenContainer
      backgroundColor={Colors.greyLight}
      withTabBar
      scrollable
      header={<ScreenHeader title={`Build #${buildNumber}`} />}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.black} style={{ marginTop: 20 }} />
      ) : error || !build ? (
        <AppText variant="body" style={styles.emptyText}>
          {error ?? 'Build introuvable'}
        </AppText>
      ) : (
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <AppText variant="h3" bold>
                Build #{build.number}
              </AppText>
              {build.result && (
                <View
                  style={[
                    styles.pill,
                    { backgroundColor: STATUS_STYLE[build.result]?.bg ?? '#d9dbd6' },
                  ]}
                >
                  <AppText
                    variant="small"
                    color={STATUS_STYLE[build.result]?.text ?? Colors.grey}
                    bold
                  >
                    {build.result}
                  </AppText>
                </View>
              )}
            </View>
            <AppText variant="small" color={Colors.grey} style={{ marginTop: 8 }}>
              {build.building ? 'En cours...' : `${Math.round(build.duration / 1000)}s`} ·{' '}
              {new Date(build.timestamp).toLocaleString()}
            </AppText>
          </View>

          <AppText variant="body" bold style={styles.sectionTitle}>
            Commits inclus
          </AppText>
          {!build.changeSets || build.changeSets.every((cs) => cs.items.length === 0) ? (
            <View style={styles.card}>
              <AppText variant="small" style={styles.emptyText}>
                Aucun commit associé à ce build.
              </AppText>
            </View>
          ) : (
            <View style={styles.card}>
              {build.changeSets.flatMap((cs, csIndex) =>
                cs.items.map((item, index) => (
                  <View
                    key={item.commitId}
                    style={[
                      styles.commitRow,
                      (csIndex > 0 || index > 0) && styles.commitRowBorder,
                    ]}
                  >
                    <AppText variant="body" bold numberOfLines={2}>
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
  content: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  sectionTitle: { marginBottom: Spacing.sm },
  commitRow: { paddingVertical: Spacing.sm },
  commitRowBorder: { borderTopWidth: 1, borderTopColor: Colors.greyLight },
  sha: { fontFamily: 'monospace' as any, marginTop: 4 },
  emptyText: { opacity: 0.5 },
});