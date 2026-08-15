import { useGoogleSignIn } from '@/src/hooks/Auth/useGoogleSignIn';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Images from "@/src/constants/images";

import AppButton from '@/src/components/common/AppButton';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import { useAuth } from '@/src/hooks/Auth/useAuth';
import { authScreenStyles as styles } from './authScreenStyles';

const loginFields: FormFieldConfig[] = [
  { key: 'email', icon: 'mail-outline', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
  { key: 'password', icon: 'lock-closed-outline', placeholder: 'Mot de passe', secureTextEntry: true },
];

export default function LoginScreen() {
  const router = useRouter();
  const { values, setField, errors, apiError, loading, handleLogin } = useAuth();
  const { signInWithGoogle, loading: googleLoading } = useGoogleSignIn();

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>Connexion</AppText>

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
          color={Colors.grey}
          onPress={() => router.push('/(auth)/forgotPassword')}
        >
          Mot de passe oublié ?
        </AppText>

        <AppButton
          label={loading ? 'Connexion...' : 'Se connecter'}
          variant="primary"
          onPress={loading ? () => { } : handleLogin}
          style={styles.primaryButton}
        />

        <AppButton
          label={googleLoading ? 'Connexion...' : 'Continuer avec Google'}
          variant="green"
          iconImage={Images.googleLogo}
          onPress={googleLoading ? () => { } : signInWithGoogle}
        />

        <AppText
          variant="small"
          color={Colors.black}
          style={styles.linkText}
          onPress={() => router.push('/(auth)/register')}
        >
          Pas encore de compte ? <AppText variant="small" style={styles.linkBold}>S'inscrire</AppText>
        </AppText>
      </View>
    </ScreenContainer>
  );
}