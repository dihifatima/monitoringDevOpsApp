import { View, FlatList, ActivityIndicator, StyleSheet, Linking, Pressable, BackHandler } from 'react-native';
import { useLocalSearchParams, router, useNavigation, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppText from '@/src/components/common/AppText';
import CommitListItem from '@/src/components/features/projects/CommitListItem';
import SonarQubeSection from '@/src/components/features/projects/SonarQubeSection';
import SonarStatusIcon from '@/src/components/features/projects/SonarStatusIcon';
import SonarQubeConnectModal from '@/src/components/features/connectors/sonarqube/Sonarqubeconnectmodal';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useTabBarHeight } from '@/src/context/TabBarHeightContext';
import { useConnectors } from '@/src/context/ConnectorsContext';
import { useRepoDetail } from '@/src/hooks/Oauth_github/useRepoDetail';
import { useCommitMeasures } from '@/src/hooks/Oauth_sonarqube/useCommitMeasures';

export default function RepoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const tabBarHeight = useTabBarHeight();

  const handleBack = () => {
    if (navigation.canGoBack()) router.back();
    else router.replace('/(tabs)/Projets');
  };

  // Actif seulement quand cet écran est affiché (évite les écouteurs fantômes)
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        handleBack();
        return true;
      });
      return () => sub.remove();
    }, [])
  );

  const {
    isLoading: reposLoading,
    selectedRepo: trackedRepo,
    commits,
    commitsLoading,
    commitsError,
    refresh,
  } = useRepoDetail(id);

  const { connectors } = useConnectors();
  const isSonarConnected = connectors.sonarqube?.status === 'CONNECTED';
  const isRepoLinked = !!trackedRepo?.sonarProjectKey;

  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const { analysisByRevision } = useCommitMeasures(
    trackedRepo?.id ?? 0,
    trackedRepo?.sonarProjectKey ?? null
  );

  const handleIconPress = () => {
    if (!isSonarConnected) {
      // Pas connecté : on demande d'abord la connexion, jamais le formulaire de liaison
      setIsConnectModalVisible(true);
      return;
    }
    if (!isRepoLinked) setShowLinkForm(true);
  };

  if (reposLoading) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        header={<ScreenHeader title="Projet" onBack={handleBack} />}
      >
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.black} />
        </View>
      </ScreenContainer>
    );
  }

  if (!trackedRepo) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        header={<ScreenHeader title="Projet" onBack={handleBack} />}
      >
        <View style={styles.centered}>
          <AppText variant="body" style={styles.emptyText}>
            Projet introuvable
          </AppText>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.greyLight}
      withTabBar
      header={
        <ScreenHeader
          title={trackedRepo.name}
          onBack={handleBack}
          rightElement={
            <SonarStatusIcon
              isSonarConnected={isSonarConnected}
              isRepoLinked={isRepoLinked}
              onPress={handleIconPress}
            />
          }
        />
      }
    >
      <View style={styles.repoInfo}>
        <AppText variant="body" bold>
          {trackedRepo.fullName}
        </AppText>
        <Pressable onPress={() => Linking.openURL(trackedRepo.url)} style={styles.linkRow}>
          <Ionicons name="link-outline" size={16} color={Colors.accent ?? Colors.black} />
          <AppText variant="small" color={Colors.accent} style={styles.linkText}>
            Voir sur GitHub
          </AppText>
        </Pressable>
        <AppText variant="small" style={styles.trackedAt}>
          Suivi depuis le {new Date(trackedRepo.trackedAt).toLocaleDateString()}
        </AppText>
      </View>

      {/* Formulaire de liaison : seulement si Sonar est connecté */}
      {isSonarConnected && showLinkForm && (
        <SonarQubeSection
          repoId={trackedRepo.id}
          sonarProjectKey={trackedRepo.sonarProjectKey}
          onLinked={() => {
            refresh();
            setShowLinkForm(false);
          }}
          forceShowLinkForm={showLinkForm}
          onDismiss={() => setShowLinkForm(false)}
        />
      )}

      <SonarQubeConnectModal
        visible={isConnectModalVisible}
        onClose={() => setIsConnectModalVisible(false)}
      />

      <AppText variant="small" bold style={styles.sectionTitle}>
        COMMITS RÉCENTS
      </AppText>

      {commitsLoading ? (
        <ActivityIndicator color={Colors.black} style={styles.commitsLoader} />
      ) : commitsError ? (
        <AppText variant="body" style={styles.emptyText}>
          {commitsError}
        </AppText>
      ) : commits.length === 0 ? (
        <AppText variant="body" style={styles.emptyText}>
          Aucun commit récent
        </AppText>
      ) : (
        <FlatList
          data={commits}
          keyExtractor={(item) => item.sha}
          renderItem={({ item }) => (
            <CommitListItem
              commit={item}
              measures={analysisByRevision.get(item.sha)?.measures}
              onPressDetail={() =>
                router.push({
                  pathname: '/(tabs)/Projets/commit-detail',
                  params: { repoId: String(trackedRepo.id), sha: item.sha },
                })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: tabBarHeight + Spacing.lg }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  repoInfo: { marginBottom: Spacing.lg },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs, gap: 4 },
  linkText: { textDecorationLine: 'underline' },
  trackedAt: { opacity: 0.5, marginTop: Spacing.xs },
  sectionTitle: { marginBottom: Spacing.sm, letterSpacing: 0.5 },
  commitsLoader: { marginTop: Spacing.lg },
  emptyText: { opacity: 0.5 },
});