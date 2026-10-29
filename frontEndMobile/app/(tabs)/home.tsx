import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useCallback, useRef } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import TabRootHeader from '@/src/components/layout/TabRootHeader';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { useConnectors } from '@/src/context/ConnectorsContext';
import { QUICK_ACTIONS_CATALOG } from '@/src/constants/quickActions';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { useRecentActivity } from '@/src/hooks/home/useRecentActivity';
import { useHomeStats } from '@/src/hooks/home/useHomeStats';
import { getHomeState, buildSteps, isConnected } from '@/src/hooks/home/useHomeState';
import HomeStatsRow from '@/src/components/features/home/HomeStatsRow';
import QuickActions from '@/src/components/features/home/QuickActions';
import RecentActivityList from '@/src/components/features/home/RecentActivityList';
import LastFailedBuildCard from '@/src/components/features/home/LastFailedBuildCard';
import OnboardingChecklist from '@/src/components/features/home/OnboardingChecklist';
import Skeleton from '@/src/components/features/home/Skeleton';
import { useTabBarHeight } from '@/src/context/TabBarHeightContext';

const githubConfig = connectorsConfig.find((c) => c.id === 'github')!;

export default function HomeScreen() {
  const { user, loading } = useAuthGlobal();
  const { stats, isLoading: statsLoading, refresh: refreshStats } = useHomeStats();
  const { activity, isLoading: activityLoading, refresh: refreshActivity } = useRecentActivity();
  const { connectors, isLoading: connectorsLoading } = useConnectors();
const tabBarHeight = useTabBarHeight();
  // Le skeleton ne s'affiche qu'au tout premier chargement
  const hasLoadedOnce = useRef(false);
  if (!statsLoading && !activityLoading) hasLoadedOnce.current = true;

  // Recharge les stats à chaque retour sur Home (ex. après avoir suivi un dépôt)
  useFocusEffect(
    useCallback(() => {
      refreshStats();
      refreshActivity();
    }, [refreshStats, refreshActivity])
  );

  const firstName = user?.fullName?.trim().split(/\s+/)[0];
  const header = (
    <TabRootHeader
      mode="greeting"
      fullName={firstName}
      avatarUri={user?.profilePicture}
      backgroundColor={Colors.green}
    />
  );

  const jenkinsLinked = stats.linkedCount > 0;
  const githubConnected = isConnected(connectors, 'github') || stats.totalRepos > 0;

  const state = getHomeState({
    loading: !hasLoadedOnce.current && (statsLoading || activityLoading || connectorsLoading),
    reposCount: stats.totalRepos,
  });

  const connectionsAction = QUICK_ACTIONS_CATALOG.find((a) => a.label === 'Connexions DevOps');
  const goConnections = () => {
    if (connectionsAction) router.navigate(connectionsAction.path);
  };

  const steps = buildSteps({
    githubConnected,
    reposCount: stats.totalRepos,
    jenkinsLinked,
    onConnectGithub: goConnections,
    onTrackRepo: () => {
      if (githubConfig.route) router.navigate(githubConfig.route);
    },
    onLinkJenkins: () => router.navigate('/(tabs)/Pipelines'),
  });

  if (loading) {
    return (
      <ScreenContainer backgroundColor={Colors.whiteLight} header={header}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.black} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={Colors.greyLight} withTabBar header={header}>
      <StatusBar style="dark" />
<ScrollView
  contentContainerStyle={[
    styles.scrollContent,
    { paddingBottom: tabBarHeight + Spacing.xs },
  ]}
  showsVerticalScrollIndicator={false}
>        {state === 'loading' && (
          <>
            <View style={styles.grid}>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} style={{ width: '48%', height: 88 }} />
              ))}
            </View>
            <Skeleton style={styles.skTitle} />
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} style={{ height: 60, marginBottom: 10 }} />
            ))}
          </>
        )}

        {state === 'new' && (
          <>
            <OnboardingChecklist steps={steps} />
            <View style={{ height: Spacing.lg }} />
            <QuickActions />
          </>
        )}

        {state === 'active' && (
          <>
            <LastFailedBuildCard activity={activity} />
            <HomeStatsRow
              totalRepos={stats.totalRepos}
              success={jenkinsLinked ? stats.success : null}
              failure={jenkinsLinked ? stats.failure : null}
              building={jenkinsLinked ? stats.building : null}
            />
            <QuickActions
              badgeKeys={connectionsAction && !jenkinsLinked ? [connectionsAction.key] : []}
            />
            <RecentActivityList activity={activity} />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  skTitle: { height: 18, width: 140, marginTop: 28, marginBottom: 14, borderRadius: 8 },
});