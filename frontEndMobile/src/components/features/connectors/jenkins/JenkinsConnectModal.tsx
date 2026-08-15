import { useState } from 'react';
import {Modal,View,StyleSheet,KeyboardAvoidingView,Platform,Pressable,} from 'react-native';
import AppText from '@/src/components/common/AppText';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AppButton from '@/src/components/common/AppButton';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useJenkinsConnection } from '@/src/hooks/Oauth_jenkins/useJenkinsConnection';

type JenkinsConnectModalProps = {
  visible: boolean;
  onClose: () => void;
  onConnected?: () => void;
};

const FIELDS: FormFieldConfig[] = [
  {
    key: 'jenkinsUrl',
    placeholder: 'http://localhost:8082',
    keyboardType: 'url',
    autoCapitalize: 'none',
  },
  {
    key: 'username',
    placeholder: 'Nom d\'utilisateur Jenkins',
    autoCapitalize: 'none',
  },
  {
    key: 'apiToken',
    placeholder: 'API Token',
    secureTextEntry: true,
    autoCapitalize: 'none',
  },
];

export default function JenkinsConnectModal({
  visible,
  onClose,
  onConnected,
}: JenkinsConnectModalProps) {
  const { connect, isConnecting, error } = useJenkinsConnection();

  const [values, setValues] = useState<Record<string, string>>({
    jenkinsUrl: '',
    username: '',
    apiToken: '',
  });

  const canSubmit =
    values.jenkinsUrl.trim().length > 0 &&
    values.username.trim().length > 0 &&
    values.apiToken.trim().length > 0 &&
    !isConnecting;

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const success = await connect({
      jenkinsUrl: values.jenkinsUrl.trim(),
      username: values.username.trim(),
      apiToken: values.apiToken.trim(),
    });

    if (success) {
      setValues({ jenkinsUrl: '', username: '', apiToken: '' });
      onConnected?.();
      onClose();
    }
  };

  const handleClose = () => {
    if (isConnecting) return;
    setValues({ jenkinsUrl: '', username: '', apiToken: '' });
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
              Connecter Jenkins
            </AppText>
            <AppText variant="small" color={Colors.grey} style={styles.subtitle}>
              Renseigne l'URL de ton instance Jenkins, ton nom d'utilisateur et
              un API Token généré depuis ton profil Jenkins.
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
                variant="primary"
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
  keyboardWrapper: { width: '100%', alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.lg,
  },
  title: { marginBottom: Spacing.xs },
  subtitle: { marginBottom: Spacing.md, lineHeight: 20 },
  error: { marginBottom: Spacing.sm },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  cancelButton: { paddingHorizontal: Spacing.md },
  connectButton: { minWidth: 120 },
  connectButtonDisabled: { opacity: 0.5 },
});