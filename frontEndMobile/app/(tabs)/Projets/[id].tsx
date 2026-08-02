import { View, FlatList, ActivityIndicator, StyleSheet, Linking, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppText from '@/src/components/common/AppText';
import CommitListItem from '@/src/components/features/projects/CommitListItem';
import SonarQubeSection from '@/src/components/features/projects/SonarQubeSection';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useRepoDetail } from '@/src/hooks/Oauth_github/useRepoDetail';
import { useState } from 'react';
import SonarStatusIcon from '@/src/components/features/projects/SonarStatusIcon';
import SonarQubeConnectModal from '@/src/components/features/connectors/sonarqube/Sonarqubeconnectmodal';
import { useConnectors } from '@/src/context/ConnectorsContext';
export default function RepoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    isLoading: reposLoading,
    selectedRepo: trackedRepo,
    commits,
    commitsLoading,
    commitsError,
    refresh, // ← ajouté
  } = useRepoDetail(id);
   const { connectors } = useConnectors();
  const isSonarConnected = connectors.sonarqube?.status === 'CONNECTED';
  const isRepoLinked = !!trackedRepo?.sonarProjectKey;

  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);
  const [forceShowLinkForm, setForceShowLinkForm] = useState(false);

  const handleIconPress = () => {
    if (!isSonarConnected) {
      setIsConnectModalVisible(true);
      return;
    }
    if (!isRepoLinked) {
      setForceShowLinkForm(true);
    }
  }


  if (reposLoading) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        header={<ScreenHeader title="Projet" />}
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
        header={<ScreenHeader title="Projet" />}
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
          rightElement={
            <SonarStatusIcon
              isSonarConnected={isSonarConnected}
              isRepoLinked={isRepoLinked}
              onPress={handleIconPress}
            />
          }
        />
      }    >
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

      {/* ↓ Nouvelle section, entre les infos du repo et les commits */}
      <SonarQubeSection
        repoId={trackedRepo.id}
        sonarProjectKey={trackedRepo.sonarProjectKey}
        onLinked={() => {
          refresh();
          setForceShowLinkForm(false);
        }}
        forceShowLinkForm={forceShowLinkForm}
        onDismiss={() => setForceShowLinkForm(false)} // ← nouveau

      />
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
          renderItem={({ item }) => <CommitListItem commit={item} />}
          contentContainerStyle={styles.listContent}
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
  listContent: { paddingBottom: Spacing.lg },
  emptyText: { opacity: 0.5 },
});