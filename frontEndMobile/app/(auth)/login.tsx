import { View } from 'react-native';
import { useRouter } from 'expo-router';

import ScreenContainer from '@/src/components/common/ScreenContainer';
import AppText from '@/src/components/common/AppText';
import AppButton from '@/src/components/common/AppButton';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import Colors from '@/src/constants/colors';
import { useAuth } from '@/src/hooks/useAuth';
import { authScreenStyles as styles } from './authScreenStyles';

const loginFields: FormFieldConfig[] = [
  { key: 'email', icon: 'mail-outline', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
  { key: 'password', icon: 'lock-closed-outline', placeholder: 'Password', secureTextEntry: true },
];

export default function LoginScreen() {
  const router = useRouter();
  const { values, setField, errors, apiError, loading, handleLogin } = useAuth();

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>Login</AppText>

        <AppForm
          fields={loginFields}
          values={values}
          errors={errors}
          onChange={setField}
        />

        {apiError && (
          <AppText variant="small" color={Colors.error} style={styles.apiError}>
            {apiError}
          </AppText>
        )}

        <AppText
          variant="small"
          color={Colors.GrisPerle}
          onPress={() => {}}
        >
          Forgot Password?
        </AppText>

        <AppButton
          label={loading ? 'Connexion...' : 'Login'}
          variant="primary"
          onPress={loading ? () => {} : handleLogin}
          style={styles.primaryButton}
        />

        <AppButton
          label="Continue with Google"
          variant="secondary"
          icon="logo-google"
          onPress={() => {}}
        />

        <AppText
          variant="small"
          color={Colors.black}
          style={styles.linkText}
          onPress={() => router.push('/(auth)/register')}
        >
          Need an account? <AppText variant="small" style={styles.linkBold}>Sign up</AppText>
        </AppText>
      </View>
    </ScreenContainer>
  );
}