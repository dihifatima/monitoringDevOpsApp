import { useRouter } from 'expo-router';
import { View } from 'react-native';

import AppButton from '@/src/components/common/AppButton';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import { useAuth } from '@/src/hooks/Auth/useAuth';
import { authScreenStyles as styles } from './authScreenStyles';

const registerFields: FormFieldConfig[] = [
  { key: 'firstname', icon: 'person-outline', placeholder: 'First name' },
  { key: 'lastname', icon: 'person-outline', placeholder: 'Last name' },
  { key: 'email', icon: 'mail-outline', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
  { key: 'password', icon: 'lock-closed-outline', placeholder: 'Password', secureTextEntry: true },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { values, setField, errors, apiError, loading, handleRegister } = useAuth();

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>Sign up</AppText>

        <AppForm
          fields={registerFields}
          values={values}
          errors={errors}
          onChange={setField}
        />

        {apiError && (
          <AppText variant="small" color={Colors.error} style={styles.apiError}>
            {apiError}
          </AppText>
        )}

        <AppButton
          label={loading ? 'Inscription en cours...' : 'Sign up'}
          variant="primary"
          onPress={loading ? () => {} : handleRegister}
          style={styles.primaryButton}
        />

        <AppText
          variant="small"
          color={Colors.black}
          style={styles.linkText}
          onPress={() => router.push('/(auth)/login')}
        >
          Already have an account? <AppText variant="small" style={styles.linkBold}>Log in</AppText>
        </AppText>
      </View>
    </ScreenContainer>
  );
}