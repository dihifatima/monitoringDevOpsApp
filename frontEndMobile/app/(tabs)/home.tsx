import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import Typography from '@/src/styles/typography';
import Spacing from '@/src/styles/spacing';
import { useRecentActivity } from '@/src/hooks/home/useRecentActivity';
import RecentActivityList from '@/src/components/features/home/RecentActivityList';
import { useAuthGlobal } from '@/src/context/AuthContext';
import TabRootHeader from '@/src/components/layout/TabRootHeader';
import { useHomeStats } from '@/src/hooks/home/useHomeStats';
import HomeStatsRow from '@/src/components/features/home/HomeStatsRow';
import QuickActions from '@/src/components/features/home/QuickActions';
export default function HomeScreen() {
  const { user, loading } = useAuthGlobal();
  const { stats } = useHomeStats();
const { activity } = useRecentActivity();


  const header = (
    <TabRootHeader
      mode="greeting"
      fullName={user?.fullName}
      avatarUri={user?.profilePicture}
    />
  );

  if (loading) {
    return (
      <ScreenContainer backgroundColor={Colors.white} header={header}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.black} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.greyLight}
      withTabBar
      header={header}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HomeStatsRow
        totalRepos={stats.totalRepos}
        success={stats.success}
       failure={stats.failure}
       building={stats.building}/>
       <QuickActions />
<RecentActivityList activity={activity} />
      </ScrollView>
      
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: Spacing.lg },
  sectionTitle: {
    fontSize: Typography.small,
    fontWeight: '700',
    color: Colors.grey ?? '#9A9A9A',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
});