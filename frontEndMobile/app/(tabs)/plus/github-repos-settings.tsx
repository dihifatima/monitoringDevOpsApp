import { View, StyleSheet, ActivityIndicator ,Text } from 'react-native';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useProfile } from '@/src/hooks/useProfile';

export default function GithubRepos() {
  const { loading } =
    useProfile();

  if (loading) {
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

  return (
    <ScreenContainer
      backgroundColor={Colors.greyLight}
      withTabBar
      header={<ScreenHeader title="Repos GitHub suivis" />}
    >
    <Text>Repos GitHub suivis</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: Spacing.lg },
});