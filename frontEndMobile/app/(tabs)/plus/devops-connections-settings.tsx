// app/(tabs)/plus/devops-connections-settings.tsx
import AppMenuSection from '@/src/components/common/AppMenuSection';
import ConnectorsList from '@/src/components/features/connectors/ConnectorsList';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import Colors from '@/src/constants/colors';
import { useConnectors } from '@/src/context/ConnectorsContext';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DevopsConnectionsSettingsScreen() {
  const { isLoading } = useConnectors();

  if (isLoading) {

    return (

      <ScreenContainer
        backgroundColor={Colors.greyLight}
        header={<ScreenHeader title="Connexions DevOps" />}
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
      header={<ScreenHeader title="Connexions DevOps" />}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>LIENS DEVOPS</Text>
        <AppMenuSection>
          <ConnectorsList />
        </AppMenuSection>
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