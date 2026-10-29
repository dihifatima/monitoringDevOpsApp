import { useMemo, useState } from 'react';
import { View, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import { useTabBarHeight } from '@/src/context/TabBarHeightContext';
import { useConnectors } from '@/src/context/ConnectorsContext';
import { isConnected } from '@/src/hooks/home/useHomeState';
import Skeleton from '@/src/components/features/home/Skeleton';
import RepoRow from '@/src/components/features/github/RepoRow';
import RepoFilterBar from '@/src/components/features/github/RepoFilterBar';
import OptionSheet from '@/src/components/features/github/OptionSheet';
import { useGithubRepos } from '@/src/hooks/Oauth_github/useGithubRepos';
import { useTrackedRepos } from '@/src/hooks/Oauth_github/useTrackedRepos';
import { useRepoFilters, SORT_LABELS, type SortKey } from '@/src/hooks/Oauth_github/useRepoFilters';
import { confirmTrack, confirmUntrack } from '@/src/utils/confirmTracking';
import type { RepoSummary } from '@/src/services/githubReposService';

const CONNECTIONS_ROUTE = '/(tabs)/plus/devops-connections-settings';
const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? 's' : ''}`;

export default function GithubRepos() {
  const { connectors, isLoading: connectorsLoading } = useConnectors();
  const githubConnected = isConnected(connectors, 'github');

  const { repos, trackedIds, isLoading, trackingId, error, track, untrack, refresh } =
    useGithubRepos();
  const f = useRepoFilters(repos, trackedIds);
  const tabBarHeight = useTabBarHeight();
  const [langOpen, setLangOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const { repos: trackedRepos } = useTrackedRepos();

  // Propriétaire principal : on n'affiche « owner/ » que pour les autres (organisations)
  const mainOwner = useMemo(() => {
    const c = new Map<string, number>();
    repos.forEach((r) => {
      const o = r.fullName.split('/')[0];
      c.set(o, (c.get(o) ?? 0) + 1);
    });
    return Array.from(c.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [repos]);

  const toggle = (repo: RepoSummary) =>
    trackedIds.has(repo.externalId)
      ? confirmUntrack(repo, () => untrack(repo))
      : confirmTrack(repo, () => track(repo));

  const open = (repo: RepoSummary) => {
    const tracked = trackedRepos.find((t) => t.externalRepoId === repo.externalId);
    if (!tracked) {
      Alert.alert('Dépôt non suivi', 'Activez le suivi de ce dépôt pour voir ses commits.');
      return;
    }
    router.navigate({
      pathname: '/(tabs)/Projets/[id]',
      params: { id: String(tracked.id) },
    });
  };

  const header = <ScreenHeader title="Mes dépôts GitHub" />;

  // Connecteurs en cours de chargement : on évite d'afficher une erreur trop tôt
  if (connectorsLoading) {
    return (
      <ScreenContainer backgroundColor={Colors.whiteLight} withTabBar header={header}>
        <View style={styles.skeletons}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} style={{ height: 72, marginBottom: 10 }} />
          ))}
        </View>
      </ScreenContainer>
    );
  }

  // GitHub pas connecté : pas d'alerte rouge, on guide vers la connexion
  if (!githubConnected) {
    return (
      <ScreenContainer backgroundColor={Colors.whiteLight} withTabBar header={header}>
        <View style={styles.notConnectedWrapper}>
          <View style={styles.card}>
            <Ionicons name="logo-github" size={40} color={Colors.black} />
            <AppText
              variant="body"
              color={Colors.grey}
              style={{ textAlign: 'center', marginVertical: 16 }}
            >
              GitHub n'est pas encore connecté. Connectez votre compte pour choisir les dépôts à
              suivre.
            </AppText>
            <Pressable
              style={styles.btn}
              onPress={() => router.navigate(CONNECTIONS_ROUTE)}
              accessibilityRole="button"
            >
              <AppText variant="body" color={Colors.white} bold>
                Connecter GitHub
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const summary =
    (f.hasFilters ? `${plural(f.filtered.length, 'résultat')} · ` : '') +
    `${plural(f.counts.tracked, 'suivi')} sur ${f.counts.all} dépôts`;

  const languageLabel =
    f.languages.length === 0
      ? 'Langage'
      : f.languages.length === 1
      ? f.languages[0]
      : `Langage · ${f.languages.length}`;

  const filterBar = (
    <RepoFilterBar
      summary={summary}
      query={f.query}
      onQueryChange={f.setQuery}
      status={f.status}
      onStatusChange={f.setStatus}
      counts={f.counts}
      languageLabel={languageLabel}
      languageActive={f.languages.length > 0}
      onOpenLanguage={() => setLangOpen(true)}
      sortActive={f.sort !== 'tracked'}
      onOpenSort={() => setSortOpen(true)}
      showReset={f.hasFilters}
      onReset={f.reset}
      loading={isLoading}
    />
  );

  if (isLoading) {
    return (
      <ScreenContainer backgroundColor={Colors.whiteLight} withTabBar header={header}>
        {filterBar}
        <View style={styles.skeletons} accessible accessibilityLabel="Chargement des dépôts">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} style={{ height: 72, marginBottom: 10 }} />
          ))}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={Colors.whiteLight} withTabBar header={header}>
      {filterBar}

      {error ? (
        <View style={styles.error}>
          <AppText variant="small" color="#5A2B2B" style={{ flex: 1 }}>
            {error}
          </AppText>
          <Pressable onPress={refresh} style={styles.retry} accessibilityRole="button">
            <AppText variant="small" bold color={Colors.link}>
              Réessayer
            </AppText>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={f.filtered}
        keyExtractor={(item) => String(item.externalId)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + 16 }]}
        renderItem={({ item }) => (
          <RepoRow
            repo={item}
            isTracked={trackedIds.has(item.externalId)}
            busy={trackingId === item.externalId}
            showOwner={item.fullName.split('/')[0] !== mainOwner}
            onToggle={() => toggle(item)}
            onOpen={() => open(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant="body" bold>
              Aucun dépôt ne correspond
            </AppText>
            <AppText variant="small" color={Colors.textMuted} style={{ textAlign: 'center' }}>
              Essayez d’autres mots ou retirez un filtre.
            </AppText>
            {f.hasFilters && (
              <Pressable onPress={f.reset} style={styles.emptyBtn} accessibilityRole="button">
                <AppText variant="small" bold color={Colors.success}>
                  Réinitialiser les filtres
                </AppText>
              </Pressable>
            )}
          </View>
        }
      />

      <OptionSheet
        visible={langOpen}
        title="Langage"
        subtitle="Choisissez un ou plusieurs langages."
        mode="multi"
        options={f.languageOptions}
        selected={f.languages}
        ctaLabel={(tmp) => `Afficher ${plural(f.countWith(tmp), 'dépôt')}`}
        onApply={(next) => {
          f.setLanguages(next);
          setLangOpen(false);
        }}
        onClose={() => setLangOpen(false)}
      />

      <OptionSheet
        visible={sortOpen}
        title="Trier par"
        mode="single"
        options={(Object.keys(SORT_LABELS) as SortKey[]).map((k) => ({
          key: k,
          label: SORT_LABELS[k],
        }))}
        selected={[f.sort]}
        onApply={(next) => {
          f.setSort(next[0] as SortKey);
          setSortOpen(false);
        }}
        onClose={() => setSortOpen(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  skeletons: { paddingHorizontal: 16, paddingTop: 4 },
  listContent: { paddingHorizontal: 16, paddingTop: 4 },
  notConnectedWrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.rougeClaire,
    borderLeftWidth: 5,
    borderLeftColor: Colors.error,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingLeft: 12,
  },
  retry: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
  empty: { alignItems: 'center', gap: 6, paddingVertical: 36, paddingHorizontal: 12 },
  emptyBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: Colors.okClaire,
    marginTop: 8,
  },
});