import { View } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import AppText from '@/src/components/common/AppText';
import AppButton from '@/src/components/common/AppButton';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import Colors from '@/src/constants/colors';
import { useAuth } from '@/src/hooks/useAuth'; 
import { authScreenStyles as styles } from './authScreenStyles';

const forgotPasswordFields: FormFieldConfig[] = [
  { key: 'email', icon: 'mail-outline', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
];

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { values, setField, errors, apiError, successMessage, loading, handleForgotPassword } = useAuth();

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>Mot de passe oublié</AppText>
        <AppText variant="small" color={Colors.black} style={styles.apiError}>
          Entrez votre email, on vous enverra un code de réinitialisation.
        </AppText>

        <AppForm fields={forgotPasswordFields} values={values} errors={errors} onChange={setField} />

        {apiError && (
          <AppText variant="small" color={Colors.error} style={styles.apiError}>{apiError}</AppText>
        )}
        {successMessage && (
          <AppText variant="small" color={Colors.green} style={styles.apiError}>{successMessage}</AppText>
        )}

        <AppButton
          label={loading ? 'Envoi...' : 'Envoyer le code'}
          variant="primary"
          onPress={loading ? () => {} : handleForgotPassword}
          style={styles.primaryButton}
        />

        {successMessage && (
          <AppButton
            label="J'ai reçu mon code"
            variant="secondary"
            onPress={() => router.push('/(auth)/resetPassword')}
            style={styles.primaryButton}
          />
        )}

        <AppText variant="small" color={Colors.black} style={styles.linkText} onPress={() => router.push('/(auth)/login')}>
          Retour à la <AppText variant="small" style={styles.linkBold}>connexion</AppText>
        </AppText>
      </View>
    </ScreenContainer>
  );
}