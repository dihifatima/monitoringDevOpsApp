import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import Colors from '@/src/constants/colors';
import { useProfile } from '@/src/hooks/Profil/useProfile';
import Spacing from '@/src/styles/spacing';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';

export default function NotificationsSettings() {
  const {
    loading,
    notificationsEnabled,
    savingNotifications,
    handleToggleNotifications,
  } = useProfile();

  if (loading) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        header={<ScreenHeader title="Notifications" />}
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
      header={<ScreenHeader title="Notifications" />}
    >
      {/* Un seul enfant direct pour neutraliser le justifyContent:'space-between'
          de ScreenContainer */}
      <View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <AppText variant="title" bold>
              Activer les notifications
            </AppText>
            <AppText variant="body" style={styles.rowSubtitle}>
              Recevoir une alerte en temps réel à chaque nouveau commit
            </AppText>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            disabled={savingNotifications}
            trackColor={{ false: Colors.grey, true: Colors.success }}
            thumbColor={Colors.white}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  rowText: { flex: 1, marginRight: Spacing.md },
  rowSubtitle: { color: Colors.black, opacity: 0.5, marginTop: 2 },
});