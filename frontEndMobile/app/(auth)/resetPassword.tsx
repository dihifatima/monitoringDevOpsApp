import { View } from 'react-native';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import AppText from '@/src/components/common/AppText';
import AppButton from '@/src/components/common/AppButton';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import Colors from '@/src/constants/colors';
import { useAuth } from '@/src/hooks/useAuth'; 
import { authScreenStyles as styles } from './authScreenStyles';

const resetPasswordFields: FormFieldConfig[] = [
  { key: 'code', icon: 'key-outline', placeholder: 'Code reçu par email', keyboardType: 'number-pad' },
  { key: 'password', icon: 'lock-closed-outline', placeholder: 'Nouveau mot de passe', secureTextEntry: true },
  { key: 'confirmPassword', icon: 'lock-closed-outline', placeholder: 'Confirmer le mot de passe', secureTextEntry: true },
];

export default function ResetPasswordScreen() {
  const { values, setField, errors, apiError, loading, handleResetPassword } = useAuth(); 

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>Nouveau mot de passe</AppText>
        <AppText variant="small" color={Colors.black} style={styles.apiError}>
          Entrez le code reçu par email ainsi que votre nouveau mot de passe.
        </AppText>

        <AppForm fields={resetPasswordFields} values={values} errors={errors} onChange={setField} />

        {apiError && (
          <AppText variant="small" color={Colors.error} style={styles.apiError}>{apiError}</AppText>
        )}

        <AppButton
          label={loading ? 'Enregistrement...' : 'Réinitialiser'}
          variant="primary"
          onPress={loading ? () => {} : handleResetPassword}
          style={styles.primaryButton}
        />
      </View>
    </ScreenContainer>
  );
}