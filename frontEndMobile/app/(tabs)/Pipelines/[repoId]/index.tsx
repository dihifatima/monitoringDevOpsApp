import { View, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useBuildList } from '@/src/hooks/Oauth_jenkins/useBuildList';

export default function PipelineBuildsScreen() {
  const { repoId } = useLocalSearchParams<{ repoId: string }>();
  const numericRepoId = Number(repoId);
  const { builds, isLoading, error } = useBuildList(numericRepoId);

  return (
    <ScreenContainer
      backgroundColor={Colors.greyLight}
      withTabBar
      header={<ScreenHeader title="Historique des builds" />}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator color={Colors.black} style={{ marginTop: 20 }} />
        ) : error ? (
          <AppText variant="body" style={styles.emptyText}>
            {error}
          </AppText>
        ) : builds.length === 0 ? (
          <AppText variant="body" style={styles.emptyText}>
            Aucun build trouvé pour ce job.
          </AppText>
        ) : (
          <FlatList
            data={[...builds].sort((a, b) => b.number - a.number)}
            keyExtractor={(item) => String(item.number)}
            renderItem={({ item }) => (
              <Pressable
                style={styles.row}
onPress={() =>
  router.push({
    pathname: '/Pipelines/[repoId]/[buildNumber]',
    params: { repoId: String(numericRepoId), buildNumber: String(item.number) },
  })
}              >
                <AppText variant="body" bold>
                  Build #{item.number}
                </AppText>
                <AppText variant="small" color={Colors.grey}>
                  Voir le détail
                </AppText>
              </Pressable>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: Spacing.md },
  row: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: { opacity: 0.5, marginTop: 20 },
});