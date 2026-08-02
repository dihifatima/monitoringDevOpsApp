// src/components/features/projects/SonarQubeSection.tsx
import { useState } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import AppForm, { FormFieldConfig } from '@/src/components/common/AppForm';
import AppButton from '@/src/components/common/AppButton';
import SonarMeasuresCard from '@/src/components/features/projects/SonarMeasuresCard';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useSonarMeasures } from '@/src/hooks/Oauth_sonarqube/useSonarMeasures';
import { useDismissedSonarBanner } from '@/src/hooks/Oauth_sonarqube/useDismissedSonarBanner';
import { linkProjectKey } from '@/src/services/connectorsService';

type SonarQubeSectionProps = {
  repoId: number;
  sonarProjectKey: string | null;
  onLinked?: () => void;
  forceShowLinkForm?: boolean;
  onDismiss?: () => void;
};

const FIELDS: FormFieldConfig[] = [
  {
    key: 'sonarProjectKey',
    placeholder: 'ex: smartflow-backend',
    autoCapitalize: 'none',
  },
];

export default function SonarQubeSection({
  repoId,
  sonarProjectKey,
  onLinked,
  forceShowLinkForm = false,
  onDismiss,
}: SonarQubeSectionProps) {
  const { isDismissed, dismiss } = useDismissedSonarBanner(repoId);

  const handleDismiss = async () => {
    await dismiss();
    onDismiss?.();
  };

  const [values, setValues] = useState<Record<string, string>>({ sonarProjectKey: '' });
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const { measures, isLoading: measuresLoading, error: measuresError } = useSonarMeasures(
    repoId,
    sonarProjectKey
  );

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleLink = async () => {
    const input = values.sonarProjectKey.trim();
    if (!input) return;

    setIsLinking(true);
    setLinkError(null);
    try {
      await linkProjectKey({ sonarProjectKey: input }, repoId);
      setValues({ sonarProjectKey: '' });
      onLinked?.();
    } catch {
      setLinkError("Clé de projet introuvable côté SonarQube. Vérifie l'orthographe.");
    } finally {
      setIsLinking(false);
    }
  };

  // --- Repo déjà lié : on affiche les métriques, rien d'autre ---
  if (sonarProjectKey) {
    return (
      <View style={styles.section}>
        <AppText variant="body" bold style={styles.sectionTitle}>
          Qualité du code
        </AppText>

        {measuresLoading ? (
          <ActivityIndicator color={Colors.black} />
        ) : measuresError ? (
          <AppText variant="small" color={Colors.error}>
            {measuresError}
          </AppText>
        ) : measures ? (
          <SonarMeasuresCard data={measures} />
        ) : null}
      </View>
    );
  }

  // --- Pas encore lié : carte fermable, sauf si l'icône force sa réapparition ---
  if (isDismissed && !forceShowLinkForm) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AppText variant="body" bold>
          Qualité du code
        </AppText>
        <Pressable onPress={handleDismiss} hitSlop={12}>
          <Ionicons name="close" size={20} color={Colors.grey} />
        </Pressable>
      </View>

      <AppText variant="small" color={Colors.grey} style={styles.hint}>
        Lie ce dépôt à son projet SonarQube pour afficher ses métriques.
      </AppText>

      <AppForm
        fields={FIELDS}
        values={values}
        errors={{}}
        onChange={handleChange}
      />

      {linkError && (
        <AppText variant="small" color={Colors.error} style={styles.error}>
          {linkError}
        </AppText>
      )}

      <AppButton
        label={isLinking ? 'Liaison...' : 'Lier ce projet'}
        variant="secondary"
        onPress={handleLink}
        style={[
          styles.linkButton,
          !values.sonarProjectKey.trim() && styles.linkButtonDisabled,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  hint: {
    marginBottom: Spacing.md,
  },
  error: {
    marginBottom: Spacing.sm,
  },
  linkButton: {
    marginTop: Spacing.xs,
  },
  linkButtonDisabled: {
    opacity: 0.5,
  },
});