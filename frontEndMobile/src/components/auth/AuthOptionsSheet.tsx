import React from 'react';
import {  StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppModal from '@/src/components/common/AppModal';
import AppText from '@/src/components/common/AppText';
import AppButton from '@/src/components/common/AppButton';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

interface AuthOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
}

const AuthOptionsSheet: React.FC<AuthOptionsSheetProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();

  return (
    <AppModal visible={visible} onClose={onClose}>
      <AppText variant="h3" color={Colors.black} style={styles.title}>
        Nouveau sur l'app ?
      </AppText>

      <AppButton
        label="S'inscrire"
        variant="primary"
        onPress={() => {
          onClose();
          router.push('/(auth)/register');
        }}
        style={styles.button}
      />

      <AppText
        variant="small"
        color={Colors.black}
        style={styles.orText}
      >
        Déjà inscrit ?
      </AppText>

      <AppButton
        label="Se connecter"
        variant="primary"
        onPress={() => {
          onClose();
          router.push('/(auth)/login');
        }}
      />
    </AppModal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    marginBottom: Spacing.md,
  },
  orText: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});

export default AuthOptionsSheet;