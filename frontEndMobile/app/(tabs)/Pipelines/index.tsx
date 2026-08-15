import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import TabRootHeader from '@/src/components/layout/TabRootHeader';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { usePipelinesOverview } from '@/src/hooks/Oauth_jenkins/usePipelinesOverview';
import PipelineCard from '@/src/components/features/pipelines/PipelineCard';
import Spacing from '@/src/styles/spacing';
import LinkJenkinsJobModal from '@/src/components/features/pipelines/LinkJenkinsJobModal';
import { useState } from 'react';

export default function PipelinesScreen() {
  const { user } = useAuthGlobal();
  const { entries, isLoading, refetch } = usePipelinesOverview();
  const [linkTarget, setLinkTarget] = useState<{ repoId: number; repoName: string } | null>(null);

  const header = (
    <TabRootHeader mode="title" title="Pipelines" avatarUri={user?.profilePicture} />
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
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => String(item.repoId)}
            renderItem={({ item }) => (
              <PipelineCard
                entry={item}
                onLinkPress={() => setLinkTarget({ repoId: item.repoId, repoName: item.repoName })}
              />
            )}
            contentContainerStyle={{ paddingBottom: Spacing.xl }}
          />
        )}
      </View>

      <LinkJenkinsJobModal
        visible={!!linkTarget}
        repoId={linkTarget?.repoId ?? null}
        repoName={linkTarget?.repoName}
        onClose={() => setLinkTarget(null)}
        onLinked={refetch}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 20 },
  emptyText: { opacity: 0.5, marginTop: 20 },
});