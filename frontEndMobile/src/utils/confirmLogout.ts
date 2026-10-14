// src/utils/confirmLogout.ts
import { Alert } from 'react-native';

export function confirmLogout(logout: () => void) {
  Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Déconnexion', style: 'destructive', onPress: () => logout() },
  ]);
}