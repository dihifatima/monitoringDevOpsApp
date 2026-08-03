import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useGithubRepos } from '@/src/hooks/Oauth_github/useGithubRepos';
import type { RepoSummary } from '@/src/services/githubReposService';

export default function GithubRepos() {
  const { repos, trackedIds, isLoading, trackingId, error, track } = useGithubRepos();

  if (isLoading) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        header={<ScreenHeader title="Repos GitHub suivis" />}
      >
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.black} />
        </View>
      </ScreenContainer>
    );
  }

  const renderItem = ({ item }: { item: RepoSummary }) => {
    const isTracked = trackedIds.has(item.externalId);
    const isTrackingThis = trackingId === item.externalId;

    return (
      <View style={styles.repoCard}>
        <View style={styles.repoInfo}>
          <Text style={styles.repoName}>{item.fullName}</Text>
          {item.description ? (
            <Text style={styles.repoDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <Text style={styles.repoMeta}>
            {item.language ?? '—'} · ★ {item.stars}
          </Text>
        </View>

        <Pressable
          onPress={() => !isTracked && track(item)}
          disabled={isTracked || isTrackingThis}
          style={[styles.trackButton, isTracked && styles.trackedButton]}
        >
          <Text style={styles.trackButtonText}>
            {isTrackingThis ? '...' : isTracked ? 'Suivi ✓' : 'Suivre'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <ScreenContainer
      backgroundColor={Colors.greyLight}
      withTabBar
      header={<ScreenHeader title="Repos GitHub suivis" />}
    >
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={repos}
        keyExtractor={(item) => String(item.externalId)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: Spacing.lg + 60 },
  repoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  repoInfo: { flex: 1, marginRight: 12 },
  repoName: { fontSize: 15, fontWeight: '700', color: Colors.black },
  repoDescription: { fontSize: 13, color: '#666', marginTop: 2 },
  repoMeta: { fontSize: 12, color: '#999', marginTop: 4 },
  trackButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Colors.black,
  },
  trackedButton: {
    backgroundColor: '#8ED17A',
  },
  trackButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 12,
  },
});