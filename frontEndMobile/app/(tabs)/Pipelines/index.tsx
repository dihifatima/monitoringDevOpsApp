import { View, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useState } from 'react';
import { useSelectedPipelineProject } from '@/src/hooks/Oauth_jenkins/useSelectedPipelineProject';
import { useBuildList } from '@/src/hooks/Oauth_jenkins/useBuildList';
import ProjectHeaderSelector from '@/src/components/features/pipelines/ProjectHeaderSelector';
import PipelineStatsRow from '@/src/components/features/pipelines/PipelineStatsRow';
import BuildTrendChart from '@/src/components/features/pipelines/BuildTrendChart';
import BuildRunRow from '@/src/components/features/pipelines/BuildRunRow';
import LinkJenkinsJobModal from '@/src/components/features/pipelines/LinkJenkinsJobModal';
import { Ionicons } from '@expo/vector-icons';

export default function PipelinesScreen() {
  const { entries, selected, selectRepo, isLoading, refetch } = useSelectedPipelineProject();
  const { builds } = useBuildList(selected?.repoId);
  const [linkModalVisible, setLinkModalVisible] = useState(false);

  const sortedBuilds = [...builds].sort((a, b) => b.number - a.number);
  const successCount = builds.filter((b) => b.number).length; // placeholder, corrigé ci-dessous si besoin

  const header = (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <ProjectHeaderSelector entries={entries} selected={selected} onSelect={selectRepo} />
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={22} color={Colors.black} />
          <Ionicons name="log-out-outline" size={22} color={Colors.black} />
        </View>
      </View>
      {selected && (
        <AppText variant="small" color={Colors.grey} style={{ marginTop: 4 }}>
          {selected.jenkinsJobName ? `Lié à Jenkins · ${builds.length} builds` : 'Pas encore lié'}
        </AppText>
      )}
    </View>
  );

  return (
    <ScreenContainer backgroundColor={Colors.greyLight} header={header}>
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator color={Colors.black} style={{ marginTop: 20 }} />
        ) : entries.length === 0 ? (
          <AppText variant="body" style={styles.emptyText}>
            Aucun dépôt suivi pour le moment.
          </AppText>
        ) : !selected?.jenkinsJobName ? (
          <View style={styles.unlinkedCard}>
            <AppText variant="h1" style={{ marginBottom: 10 }}>🔗</AppText>
            <AppText variant="body" color={Colors.grey} style={{ textAlign: 'center', marginBottom: Spacing.md }}>
              Ce projet n'est pas encore lié à un job Jenkins.
            </AppText>
            <Pressable style={styles.linkBtn} onPress={() => setLinkModalVisible(true)}>
              <AppText variant="body" color={Colors.white} bold>
                Lier un job Jenkins
              </AppText>
            </Pressable>
          </View>
        ) : (
          <>
            <PipelineStatsRow
              success={builds.filter((b) => (b as any).result === 'SUCCESS').length}
              failure={builds.filter((b) => (b as any).result === 'FAILURE').length}
            />
            <BuildTrendChart builds={builds as any} />

            <AppText variant="body" bold style={{ marginBottom: Spacing.sm }}>
              Builds récents
            </AppText>
            <FlatList
              data={sortedBuilds.slice(0, 10)}
              keyExtractor={(item) => String(item.number)}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <BuildRunRow
                  number={item.number}
                  result={(item as any).result ?? null}
                  building={(item as any).building ?? false}
                  duration={(item as any).duration ?? 0}
                  timestamp={(item as any).timestamp ?? Date.now()}
                  onPress={() =>
                    router.push({
                      pathname: '/Pipelines/[repoId]/[buildNumber]',
                      params: { repoId: String(selected.repoId), buildNumber: String(item.number) },
                    })
                  }
                />
              )}
            />
          </>
        )}
      </View>

      {selected && (
        <LinkJenkinsJobModal
          visible={linkModalVisible}
          repoId={selected.repoId}
          repoName={selected.repoName}
          onClose={() => setLinkModalVisible(false)}
          onLinked={refetch}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerIcons: { flexDirection: 'row', gap: 16 },
  content: { flex: 1, padding: 20, paddingTop: 0 },
  emptyText: { opacity: 0.5, marginTop: 20 },
  unlinkedCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: 30,
    alignItems: 'center',
  },
  linkBtn: { backgroundColor: Colors.black, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
});