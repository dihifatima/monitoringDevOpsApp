import AuthOptionsSheet from '@/src/components/auth/AuthOptionsSheet';
import AppButton from '@/src/components/common/AppButton';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Illustration from "@/src/components/onboarding/Illustration";
import Colors from '@/src/constants/colors';
import Images from "@/src/constants/images";
import { useGoogleSignIn } from '@/src/hooks/useGoogleSignIn';
import Spacing from '@/src/styles/spacing';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function WelcomeScreen() {
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const { signInWithGoogle, loading: googleLoading } = useGoogleSignIn(); 

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.content}>

        <View style={styles.illustrationWrapper}>
          <Illustration source={Images.devopsIllustration} />
        </View>

        <AppText variant="h1" style={styles.title}>
          Bienvenue
        </AppText>
        
        <AppText variant="body" color={Colors.black} style={styles.subtitle}>
          Suivez vos projets DevOps en un coup d'œil
        </AppText>

        <View style={styles.actions}>
          <AppButton
            label={googleLoading ? 'Connexion...' : 'Continuer avec Google'} 
            variant="secondary"
            icon="logo-google"
            onPress={googleLoading ? () => {} : signInWithGoogle} 
          />
          <AppButton
            label="Continuer avec Email"
            variant="text"
            onPress={() => setShowAuthSheet(true)}
          />

        </View>
      </View>
      <AuthOptionsSheet
        visible={showAuthSheet}
        onClose={() => setShowAuthSheet(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  illustration: {
    width: 220,
    height: 220,
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  actions: {
    width: '100%',
    gap: Spacing.sm,
  },
  link: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  linkBold: {
    color: Colors.black,
    fontWeight: '600',
  },
  illustrationWrapper: {
    marginTop: Spacing.xl,
  },
});