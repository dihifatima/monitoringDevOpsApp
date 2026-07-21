import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AppButton from '@/src/components/common/AppButton';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useProfile } from '@/src/hooks/useProfile';

const fields: FormFieldConfig[] = [
  {
    key: 'currentPassword',
    placeholder: 'Mot de passe actuel',
    icon: 'lock-closed-outline',
    secureTextEntry: true,
  },
  {
    key: 'newPassword',
    placeholder: 'Nouveau mot de passe',
    icon: 'key-outline',
    secureTextEntry: true,
  },
  {
    key: 'confirmPassword',
    placeholder: 'Confirmer le nouveau mot de passe',
    icon: 'key-outline',
    secureTextEntry: true,
  },
];

export default function PasswordSettings() {
  const {
    loading,
    passwordValues,
    passwordErrors,
    savingPassword,
    handlePasswordChange,
    handlePasswordSubmit,
  } = useProfile();

  if (loading) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        header={<ScreenHeader title="Mot de passe" />}
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
      header={<ScreenHeader title="Mot de passe" />}
      footer={
        <AppButton
          label={savingPassword ? 'Enregistrement...' : 'Enregistrer'}
          onPress={savingPassword ? () => {} : handlePasswordSubmit}
          variant="primary"
        />
      }
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppForm
          fields={fields}
          values={passwordValues}
          errors={passwordErrors}
          onChange={handlePasswordChange}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: Spacing.lg },
});