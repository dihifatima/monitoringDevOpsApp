import { View, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import TabRootHeader from '@/src/components/layout/TabRootHeader';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { useConnectors } from '@/src/context/ConnectorsContext';
import { useTabBarHeight } from '@/src/context/TabBarHeightContext';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { isConnected } from '@/src/hooks/home/useHomeState';
import { useSelectedPipelineProject } from '@/src/hooks/Oauth_jenkins/useSelectedPipelineProject';
import { useBuildList } from '@/src/hooks/Oauth_jenkins/useBuildList';
import ProjectHeaderSelector from '@/src/components/features/pipelines/ProjectHeaderSelector';
import PipelineStatsRow from '@/src/components/features/pipelines/PipelineStatsRow';
import BuildTrendChart from '@/src/components/features/pipelines/BuildTrendChart';
import BuildRunRow from '@/src/components/features/pipelines/BuildRunRow';
import LinkJenkinsJobModal from '@/src/components/features/pipelines/LinkJenkinsJobModal';

const githubConfig = connectorsConfig.find((c) => c.id === 'github')!;
const CONNECTIONS_ROUTE = '/(tabs)/plus/devops-connections-settings';

export default function PipelinesScreen() {
  const { user } = useAuthGlobal();
  const { connectors } = useConnectors();
  const tabBarHeight = useTabBarHeight();
  const { entries, selected, selectRepo, isLoading, refetch } = useSelectedPipelineProject();
  const { builds } = useBuildList(selected?.repoId);
  const [linkModalVisible, setLinkModalVisible] = useState(false);

  const githubConnected = isConnected(connectors, 'github');
  const jenkinsConnected = isConnected(connectors, 'jenkins');

  const sortedBuilds = [...builds].sort((a, b) => b.number - a.number);
  const recentBuilds = sortedBuilds.slice(0, 10);

  const header = (
    <TabRootHeader
      mode="title"
      title="Pipelines"
      avatarUri={user?.profilePicture}
      backgroundColor={Colors.green}
    />
  );

  const goGithub = () => {
    if (githubConnected) {
      if (githubConfig.route) router.navigate(githubConfig.route);
    } else {
      router.navigate(CONNECTIONS_ROUTE);
    }
  };

  const onJenkinsButton = () => {
    if (jenkinsConnected) setLinkModalVisible(true);
    else router.navigate(CONNECTIONS_ROUTE);
  };

  return (
    <ScreenContainer backgroundColor={Colors.greyLight} withTabBar header={header}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + Spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {entries.length > 0 && (
          <>
            <ProjectHeaderSelector entries={entries} selected={selected} onSelect={selectRepo} />
            {selected && (
              <AppText
                variant="small"
                color={Colors.grey}
                style={{ marginTop: 4, marginBottom: Spacing.md }}
              >
                {selected.jenkinsJobName
                  ? `Lié à Jenkins · ${builds.length} builds`
                  : jenkinsConnected
                    ? 'Pas encore lié'
                    : 'Jenkins non connecté'}
              </AppText>
            )}
          </>
        )}

        {isLoading ? (
          <ActivityIndicator color={Colors.black} style={{ marginTop: 20 }} />
        ) : entries.length === 0 ? (
          <View style={styles.card}>
            <AppText
              variant="body"
              color={Colors.black}
              style={{ textAlign: 'center', marginBottom: Spacing.md }}
            >
              {githubConnected
                ? 'Aucun dépôt suivi. Choisissez les dépôts à suivre.'
                : 'Aucun dépôt suivi pour le moment. Connectez GitHub pour commencer.'}
            </AppText>
            <Pressable style={styles.btn} onPress={goGithub}>
              <AppText variant="body" color={Colors.white} bold>
                {githubConnected ? 'Suivre un dépôt' : 'Connecter GitHub'}
              </AppText>
            </Pressable>
          </View>
        ) : !selected?.jenkinsJobName ? (
          <View style={styles.card}>
            <AppText
              variant="body"
              color={Colors.grey}
              style={{ textAlign: 'center', marginBottom: Spacing.md }}
            >
              {jenkinsConnected
                ? "Ce projet n'est pas encore lié à un job Jenkins."
                : "Jenkins n'est pas encore connecté. Connectez-le pour suivre vos builds."}
            </AppText>
            <Pressable style={styles.btn} onPress={onJenkinsButton}>
              <AppText variant="body" color={Colors.white} bold>
                {jenkinsConnected ? 'Lier un job Jenkins' : 'Connecter Jenkins'}
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
            {recentBuilds.map((item, index) => (
              <BuildRunRow
                key={item.number}
                number={item.number}
                result={(item as any).result ?? null}
                building={(item as any).building ?? false}
                duration={(item as any).duration ?? 0}
                timestamp={(item as any).timestamp ?? Date.now()}
                branch={(item as any).branch ?? null}
                triggeredBy={(item as any).triggeredBy ?? null}
                isLast={index === recentBuilds.length - 1}
                onPress={() =>
                  router.push({
                    pathname: '/Pipelines/[repoId]/[buildNumber]',
                    params: {
                      repoId: String(selected.repoId),
                      buildNumber: String(item.number),
                    },
                  })
                }
              />
            ))}
          </>
        )}
      </ScrollView>

      {selected && jenkinsConnected && (
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
  content: { padding: 20, paddingTop: Spacing.md },
  card: {
    backgroundColor: Colors.greyLight,
    borderRadius: Spacing.cardRadius,
    padding: 30,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
});