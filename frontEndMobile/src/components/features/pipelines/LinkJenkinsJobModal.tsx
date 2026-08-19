import { useState } from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import AppText from '@/src/components/common/AppText';
import AppInput from '@/src/components/common/AppInput';
import AppButton from '@/src/components/common/AppButton';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useLinkJenkinsJob } from '@/src/hooks/Oauth_jenkins/useLinkJenkinsJob';

type Props = {
  visible: boolean;
  repoId: number | null;
  repoName?: string;
  onClose: () => void;
  onLinked: () => void;
};

export default function LinkJenkinsJobModal({ visible, repoId, repoName, onClose, onLinked }: Props) {
  const [jobName, setJobName] = useState('');
  const { link, isLinking, error, reset } = useLinkJenkinsJob();

  const handleClose = () => {
    if (isLinking) return;
    setJobName('');
    reset(); // ← efface l'erreur affichée avant la prochaine ouverture
    onClose();
  };

  const handleConfirm = async () => {
    if (!repoId || !jobName.trim()) return;
    const success = await link({ repoId, jenkinsJobName: jobName.trim() });
    if (success) {
      setJobName('');
      reset();
      onLinked();
      onClose();
    }
  };

  const canSubmit = !!jobName.trim() && !isLinking;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <AppText variant="h3" bold>
            Lier un job Jenkins
          </AppText>
          <AppText variant="small" color={Colors.grey} style={styles.subtitle}>
            {repoName
              ? `Indique le nom exact du job Jenkins correspondant à ${repoName}.`
              : 'Indique le nom exact du job Jenkins.'}
          </AppText>

          <AppInput
            placeholder="ex: SmartFlow"
            value={jobName}
            onChangeText={setJobName}
            autoCapitalize="none"
            style={styles.input}
          />

          {error && (
            <AppText variant="small" color="#C0392B" style={styles.error}>
              {error}
            </AppText>
          )}

          <View style={styles.actions}>
            <Pressable onPress={handleClose} disabled={isLinking}>
              <AppText variant="body" bold>
                Annuler
              </AppText>
            </Pressable>
            <AppButton
              label={isLinking ? 'Liaison...' : 'Confirmer'}
              variant="primary"
              onPress={handleConfirm}
              style={!canSubmit && styles.buttonDisabled}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.lg,
  },
  subtitle: { marginTop: 6, marginBottom: Spacing.md },
  input: { marginBottom: Spacing.sm },
  error: { marginBottom: Spacing.sm },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: { opacity: 0.5 },
});