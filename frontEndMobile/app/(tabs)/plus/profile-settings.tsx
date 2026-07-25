// app/(tabs)/plus/profile-settings.tsx
import AppButton from '@/src/components/common/AppButton';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AvatarPicker from '@/src/components/common/AvatarPicker';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import ScreenHeader from '@/src/components/layout/ScreenHeader';
import Colors from '@/src/constants/colors';
import { useProfile } from '@/src/hooks/Profil/useProfile';
import Spacing from '@/src/styles/spacing';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

const fields: FormFieldConfig[] = [
  { key: 'fullName', placeholder: 'Nom complet', icon: 'person-outline' },
  { key: 'email', placeholder: 'Email', icon: 'mail-outline', editable: false },
  { key: 'jobTitle', placeholder: 'Poste occupé', icon: 'briefcase-outline' },
  { key: 'company', placeholder: 'Entreprise', icon: 'business-outline' },
];

export default function ProfileSettings() {
  const { profile, values, loading, saving, error, handleChange, handleSubmit } =
    useProfile();

  if (loading) {
    return (
      <ScreenContainer
        backgroundColor={Colors.greyLight}
        header={<ScreenHeader title="Édition profil" />}
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
      header={<ScreenHeader title="Édition profil" />}
      footer={
        <AppButton
          label={saving ? 'Enregistrement...' : 'Enregistrer'}
          onPress={saving ? () => {} : handleSubmit}
          variant="primary"
        />
      }
    >
      {/* Main : contenu scrollable */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AvatarPicker
          imageUri={profile?.profilePicture}
          onPress={() => {}}
        />

        <AppForm
          fields={fields}
          values={{ ...values, email: profile?.email ?? '' }}
          errors={{ fullName: error }}
          onChange={handleChange}
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