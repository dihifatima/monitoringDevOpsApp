import AppText from '@/src/components/common/AppText';
import TrackedRepoListItem from '@/src/components/features/projects/TrackedRepoListItem';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import TabRootHeader from '@/src/components/layout/TabRootHeader';
import Colors from '@/src/constants/colors';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { useConnectors } from '@/src/context/ConnectorsContext';
import { useTabBarHeight } from '@/src/context/TabBarHeightContext';
import { isConnected } from '@/src/hooks/home/useHomeState';
import { useTrackedRepos } from '@/src/hooks/Oauth_github/useTrackedRepos';
import Spacing from '@/src/styles/spacing';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { TrackedRepoResponse } from '@/src/services/githubReposService';

type SortMode = 'recent' | 'alpha' | 'language' | 'date';

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'recent', label: 'Activité récente' },
  { key: 'alpha', label: 'Alphabétique' },
  { key: 'language', label: 'Langage' },
  { key: 'date', label: 'Date' },
];

const githubConfig = connectorsConfig.find((c) => c.id === 'github')!;

function sortRepos(repos: TrackedRepoResponse[], mode: SortMode): TrackedRepoResponse[] {
  const copy = [...repos];
  switch (mode) {
    case 'alpha':
      return copy.sort((a, b) => a.fullName.localeCompare(b.fullName));
    case 'language':
      return copy.sort((a, b) => (a.language ?? '').localeCompare(b.language ?? ''));
    case 'date':
      return copy.sort(
        (a, b) => new Date(b.trackedAt).getTime() - new Date(a.trackedAt).getTime()
      );
    case 'recent':
    default:
      return copy.sort((a, b) => {
        const aDate = a.lastCommitDate ? new Date(a.lastCommitDate).getTime() : 0;
        const bDate = b.lastCommitDate ? new Date(b.lastCommitDate).getTime() : 0;
        return bDate - aDate;
      });
  }
}

export default function ProjetsScreen() {
  const { user } = useAuthGlobal();
  const { connectors } = useConnectors();
  const tabBarHeight = useTabBarHeight();
  const { repos: trackedRepos, isLoading, error, refresh } = useTrackedRepos();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  const githubConnected = isConnected(connectors, 'github');

  const filteredRepos = useMemo(() => {
    const filtered = trackedRepos.filter((repo) =>
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return sortRepos(filtered, sortMode);
  }, [trackedRepos, searchQuery, sortMode]);

  const header = (
    <TabRootHeader
      mode="title"
      title="Projets"
      avatarUri={user?.profilePicture}
      backgroundColor={Colors.green}
    />
  );

  const goGithub = () => {
    if (githubConnected) {
      if (githubConfig.route) router.navigate(githubConfig.route);
    } else {
      router.navigate('/(tabs)/plus/devops-connections-settings');
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer backgroundColor={Colors.greyLight} withTabBar header={header}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.black} />
        </View>
      </ScreenContainer>
    );
  }

  // Aucun dépôt suivi : on guide vers la connexion GitHub
  if (!error && trackedRepos.length === 0) {
    return (
      <ScreenContainer backgroundColor={Colors.white} withTabBar header={header}>
        <View style={styles.emptyWrapper}>
          <View style={styles.card}>
            <Ionicons name="logo-github" size={40} color={Colors.black} />
            <AppText
              variant="body"
              color={Colors.black}
              style={{ textAlign: 'center', marginVertical: Spacing.md }}
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
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={Colors.greyLight} withTabBar header={header}>
      <AppText variant="small" style={styles.subtitle}>
        {trackedRepos.length} dépôt{trackedRepos.length > 1 ? 's' : ''} suivi
        {trackedRepos.length > 1 ? 's' : ''}
      </AppText>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color={Colors.accent} style={styles.searchIcon} />
          <TextInput
            placeholder="Rechercher un dépôt..."
            placeholderTextColor={Colors.accent}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
        <Pressable style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={Colors.black} />
        </Pressable>
      </View>

      <View style={styles.chipsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {SORT_OPTIONS.map((option) => {
            const active = option.key === sortMode;
            return (
              <Pressable
                key={option.key}
                onPress={() => setSortMode(option.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <AppText variant="small" style={active ? styles.chipTextActive : styles.chipText}>
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <AppText variant="small" style={styles.resultsCount}>
        {filteredRepos.length} RÉSULTAT{filteredRepos.length > 1 ? 'S' : ''}
      </AppText>

      {error ? (
        <View style={styles.centered}>
          <AppText variant="body" style={styles.errorText}>
            {error}
          </AppText>
        </View>
      ) : filteredRepos.length === 0 ? (
        <View style={styles.centered}>
          <AppText variant="body" style={styles.emptyText}>
            Aucun dépôt ne correspond à votre recherche
          </AppText>
        </View>
      ) : (
        <FlatList
          data={filteredRepos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TrackedRepoListItem
              repo={item}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/Projets/[id]',
                  params: { id: String(item.id) },
                })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: tabBarHeight + Spacing.lg }}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={isLoading}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWrapper: { flex: 1, justifyContent: 'center' },
  card: {
    backgroundColor: Colors.white,
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
  errorText: { color: Colors.error ?? '#D32F2F' },
  emptyText: { opacity: 0.5, textAlign: 'center' },
  subtitle: { opacity: 0.5, marginBottom: Spacing.sm },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Spacing.inputRadius,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.black },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: Spacing.inputRadius,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // flexGrow: 0 + hauteur fixe : le ScrollView horizontal ne s'étire plus verticalement
  chipsRow: { flexGrow: 0, flexShrink: 0, height: 40, marginBottom: Spacing.sm },
  chipsContent: { gap: 8, paddingRight: Spacing.md, alignItems: 'center' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.black },
  chipText: { color: Colors.black, opacity: 0.6 },
  chipTextActive: { color: Colors.white },
  resultsCount: { opacity: 0.5, marginBottom: Spacing.sm },
});