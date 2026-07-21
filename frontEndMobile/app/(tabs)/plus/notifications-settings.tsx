import { View, StyleSheet, ActivityIndicator, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useProfile, NotificationFrequency } from '@/src/hooks/useProfile';

const FREQUENCY_OPTIONS: { value: NotificationFrequency; label: string; description: string }[] = [
  { value: 'REALTIME', label: 'Temps réel', description: 'Une notification pour chaque événement' },
  { value: 'DAILY_SUMMARY', label: 'Résumé quotidien', description: 'Un récapitulatif chaque jour' },
  { value: 'WEEKLY_SUMMARY', label: 'Résumé hebdomadaire', description: 'Un récapitulatif chaque semaine' },
];

export default function NotificationsSettings() {
  const {
    loading,
    notificationsEnabled,
    notificationFrequency,
    savingNotifications,
    handleToggleNotifications,
    handleFrequencyChange,
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
          de ScreenContainer (hérité du style pensé pour l'onboarding) */}
      <View>
        {/* Toggle principal */}
        <View style={styles.row}>
          <View style={styles.rowText}>
            <AppText variant="title" bold>
              Activer les notifications
            </AppText>
            <AppText variant="body" style={styles.rowSubtitle}>
              Recevoir des alertes sur les builds, PR et scans
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

        {/* Fréquence — désactivée visuellement si notifications OFF */}
        <View style={[styles.section, !notificationsEnabled && styles.sectionDisabled]}>
          <AppText variant="title" bold style={styles.sectionTitle}>
            Fréquence
          </AppText>

          {FREQUENCY_OPTIONS.map((option) => {
            const isSelected = notificationFrequency === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() => notificationsEnabled && handleFrequencyChange(option.value)}
                disabled={!notificationsEnabled || savingNotifications}
                style={styles.optionRow}
              >
                <View style={styles.optionText}>
                  <AppText variant="body" bold color={Colors.accent}>{option.label}</AppText>
                  <AppText variant="small" style={styles.rowSubtitle}>
                    {option.description}
                  </AppText>
                </View>
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={25}
                  color={isSelected ? Colors.success : Colors.black}
                />
              </Pressable>
            );
          })}
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
  section: { marginTop: Spacing.lg },
  sectionDisabled: { opacity: 0.4 },
  sectionTitle: { marginBottom: Spacing.sm, letterSpacing: 0.5 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  optionText: { flex: 1, marginRight: Spacing.md },
});