// src/components/features/connectors/SonarQubeConnectModal.tsx
import { useState } from 'react';
import {Modal,View, StyleSheet,KeyboardAvoidingView,Platform,Pressable,} from 'react-native';
import AppText from '@/src/components/common/AppText';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AppButton from '@/src/components/common/AppButton';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useSonarQubeConnection } from '@/src/hooks/Oauth_sonarqube/useSonarQubeConnection';

type SonarQubeConnectModalProps = {
  visible: boolean;
  onClose: () => void;
  onConnected?: () => void;
};

const FIELDS: FormFieldConfig[] = [
  {
    key: 'sonarQubeUrl',
    placeholder: 'http://host.docker.internal:9000',
    keyboardType: 'url',
    autoCapitalize: 'none',
  },
  {
    key: 'token',
    placeholder: 'squ_...',
    secureTextEntry: true,
    autoCapitalize: 'none',
  },
];

export default function SonarQubeConnectModal({
  visible,
  onClose,
  onConnected,
}: SonarQubeConnectModalProps) {
  const { connect, isConnecting, error } = useSonarQubeConnection();

  const [values, setValues] = useState<Record<string, string>>({
    sonarQubeUrl: '',
    token: '',
  });

  const canSubmit =
    values.sonarQubeUrl.trim().length > 0 && values.token.trim().length > 0 && !isConnecting;

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const success = await connect({
      sonarQubeUrl: values.sonarQubeUrl.trim(),
      token: values.token.trim(),
    });

    if (success) {
      setValues({ sonarQubeUrl: '', token: '' });
      onConnected?.();
      onClose();
    }
  };

  const handleClose = () => {
    if (isConnecting) return;
    setValues({ sonarQubeUrl: '', token: '' });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrapper}
        >
          <Pressable style={styles.card} onPress={() => {}}>
            <AppText variant="title" bold style={styles.title}>
              Connecter SonarQube
            </AppText>
            <AppText variant="small" color={Colors.grey} style={styles.subtitle}>
              Renseigne l'URL de ton serveur SonarQube et un token utilisateur
              généré depuis My Account &gt; Security.
            </AppText>

            <AppForm
              fields={FIELDS}
              values={values}
              errors={{}}
              onChange={handleChange}
            />

            {error && (
              <AppText variant="small" color={Colors.error} style={styles.error}>
                {error}
              </AppText>
            )}

            <View style={styles.actions}>
              <AppButton
                label="Annuler"
                variant="text"
                onPress={handleClose}
                style={styles.cancelButton}
              />
              <AppButton
                label={isConnecting ? 'Connexion...' : 'Connecter'}
                variant="secondary"
                onPress={handleSubmit}
                style={[styles.connectButton, !canSubmit && styles.connectButtonDisabled]}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 8, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  keyboardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  error: {
    marginBottom: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  cancelButton: {
    paddingHorizontal: Spacing.md,
  },
  connectButton: {
    minWidth: 120,
  },
  connectButtonDisabled: {
    opacity: 0.5,
  },
});