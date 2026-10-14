// src/utils/confirmTracking.ts
// Les deux confirmations existantes, partagées entre la liste et le détail.
import { Alert } from 'react-native';
import type { RepoSummary } from '@/src/services/githubReposService';

export function confirmTrack(repo: RepoSummary, onConfirm: () => void) {
  Alert.alert(
    'Suivre ce dépôt',
    `Pour recevoir les notifications en temps réel, un webhook sera installé sur ${repo.name} dans votre compte GitHub. Il pourra être supprimé à tout moment en arrêtant le suivi.`,
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Autoriser et suivre', onPress: onConfirm },
    ]
  );
}

export function confirmUntrack(repo: RepoSummary, onConfirm: () => void) {
  Alert.alert(
    'Ne plus suivre',
    `Arrêter le suivi de ${repo.name} ? Le webhook GitHub sera supprimé.`,
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', style: 'destructive', onPress: onConfirm },
    ]
  );
}