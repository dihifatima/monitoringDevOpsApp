import { View, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import AppText from '@/src/components/common/AppText';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AppButton from '@/src/components/common/AppButton';
import AvatarPicker from '@/src/components/common/AvatarPicker';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useProfile } from '@/src/hooks/useProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const fields: FormFieldConfig[] = [
  { key: 'fullName', placeholder: 'Nom complet', icon: 'person-outline' },
  { key: 'email', placeholder: 'Email', icon: 'mail-outline', editable: false },
  { key: 'jobTitle', placeholder: 'Poste occupé', icon: 'briefcase-outline' },
  { key: 'company', placeholder: 'Entreprise', icon: 'business-outline' },
];

export default function ProfileSettings() {
    const insets = useSafeAreaInsets();

  const { profile, values, loading, saving, error, handleChange, handleSubmit } =
    useProfile();

  if (loading) {
    return (
      <ScreenContainer backgroundColor={Colors.white}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.black} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </Pressable>
          <AppText variant="h3" bold style={styles.headerTitle}>
            Modifier le profil
          </AppText>
          <View style={{ width: 24 }} />
        </View>

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

        <View style={styles.footer}>
          <AppButton
            label={saving ? 'Enregistrement...' : 'Enregistrer'}
            onPress={saving ? () => {} : handleSubmit}
            variant="primary"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerTitle: { flex: 1, textAlign: 'center' },
  scrollContent: { paddingBottom: Spacing.lg },
  footer: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
});