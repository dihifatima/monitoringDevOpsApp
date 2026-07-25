import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import Typography from '@/src/styles/typography';
import Spacing from '@/src/styles/spacing';
import { useAuthGlobal } from '@/src/context/AuthContext';
import TabRootHeader from '@/src/components/layout/TabRootHeader';

export default function HomeScreen() {
  const { user, loading } = useAuthGlobal();

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
        <Text style={styles.sectionTitle}>Home Screen</Text>
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