import AppButton from '@/src/components/common/AppButton';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { authScreenStyles as styles } from './authScreenStyles';

const activateAccountFields: FormFieldConfig[] = [
  { key: 'code', icon: 'key-outline', placeholder: 'Code reçu par email', keyboardType: 'number-pad' },
];

export default function ActivateAccountScreen() {
  const router = useRouter();
  const { values, setField, errors, apiError, successMessage, loading, handleActivateAccount } = useAuth(); 
  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>Activer votre compte</AppText>
        <AppText variant="small" color={Colors.grey} style={styles.apiError}>
          Entrez le code d'activation reçu par email pour finaliser votre inscription.
        </AppText>

        <AppForm fields={activateAccountFields} values={values} errors={errors} onChange={setField} />

        {apiError && (
          <AppText variant="small" color={Colors.error} style={styles.apiError}>{apiError}</AppText>
        )}
        {successMessage && (
          <AppText variant="small" color={Colors.green} style={styles.apiError}>{successMessage}</AppText>
        )}

        <AppButton
          label={loading ? 'Activation...' : 'Activer mon compte'}
          variant="primary"
          onPress={loading ? () => {} : handleActivateAccount}
          style={styles.primaryButton}
        />

        <AppText variant="small" color={Colors.black} style={styles.linkText} onPress={() => router.push('/(auth)/login')}>
          Retour à la <AppText variant="small" style={styles.linkBold}>connexion</AppText>
        </AppText>
      </View>
    </ScreenContainer>
  );
}