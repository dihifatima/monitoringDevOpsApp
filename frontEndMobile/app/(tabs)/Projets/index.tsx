import AppText from '@/src/components/common/AppText';
import TrackedRepoListItem from '@/src/components/features/projects/TrackedRepoListItem';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import TabRootHeader from '@/src/components/layout/TabRootHeader';
import Colors from '@/src/constants/colors';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { useTrackedRepos } from '@/src/hooks/Oauth_github/useTrackedRepos';
import Spacing from '@/src/styles/spacing';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function ProjetsScreen() {
  const { user } = useAuthGlobal();
  const { repos: trackedRepos, isLoading, error, refresh } = useTrackedRepos();

  const header = (
    <TabRootHeader mode="title" title="Projets" avatarUri={user?.profilePicture} />
  );

  if (isLoading) {
    return (
      <ScreenContainer backgroundColor={Colors.greyLight} header={header}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.black} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={Colors.greyLight} withTabBar header={header}>
      {error ? (
        <View style={styles.centered}>
          <AppText variant="body" style={styles.errorText}>
            {error}
          </AppText>
        </View>
      ) : trackedRepos.length === 0 ? (
        <View style={styles.centered}>
          <AppText variant="body" style={styles.emptyText}>
            Aucun projet suivi pour l'instant
          </AppText>
        </View>
      ) : (
        <FlatList
          data={trackedRepos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TrackedRepoListItem
              repo={item}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/Projets/[id]',
                  params: { id: String(item.id) },
                })
              } />
          )}
          contentContainerStyle={styles.listContent}
          onRefresh={refresh}
          refreshing={isLoading}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: Spacing.lg },
  errorText: { color: Colors.error ?? '#D32F2F' },
  emptyText: { opacity: 0.5 },
});