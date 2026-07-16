import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuthGlobal } from '@/src/context/AuthContext'; // Import de ton état global
import { TokenStorage } from '@/src/storage/TokenStorage'; // Import de ton stockage de token
import AppText from '@/src/components/common/AppText'; // Remplace par ton composant texte si besoin
import AppButton from '@/src/components/common/AppButton'; // Remplace par ton composant bouton[cite: 1]

export default function HomeScreen() {
  const { user, loading, logout } = useAuthGlobal(); // Récupère l'utilisateur connecté
  const [token, setToken] = useState<string | null>(null);
  

  // Récupérer le jeton JWT pour l'afficher à l'écran (uniquement pour ton test)
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await TokenStorage.getToken();
      setToken(storedToken);
    };
    fetchToken();
  }, [user]); // Se met à jour si l'utilisateur change

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText variant="h1" style={styles.mainTitle}>
        Tableau de bord 🚀
      </AppText>
      
      <AppText style={styles.subtitle}>
        welcome index
      </AppText>

      {/* --- Section Informations Utilisateur --- */}
      <View style={styles.card}>
        <AppText variant="h2" style={styles.cardTitle}>
          👤 Infos Utilisateur (depuis /auth/me)
        </AppText>
        
        <View style={styles.infoRow}>
          <AppText bold>Nom complet : </AppText>
          <AppText>{user?.fullName || 'Non défini'}</AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText bold>Email : </AppText>
          <AppText>{user?.email || 'Non défini'}</AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText bold>Rôles : </AppText>
          <AppText>{user?.roles?.join(', ') || 'Aucun rôle'}</AppText>
        </View>
      </View>

      {/* --- Section Jeton JWT --- */}
      <View style={styles.card}>
        <AppText variant="h2" style={styles.cardTitle}>
          🔑 Token JWT (Stocké localement)
        </AppText>
        <AppText style={styles.tokenText} selectable>
          {token ? token : "Aucun token trouvé en mémoire."}
        </AppText>
      </View>

      {/* --- Bouton de Déconnexion --- */}
      <AppButton 
        label="Tester la Déconnexion" 
        variant="primary" 
        onPress={logout} // Déconnecte et redirige vers /login[cite: 4]
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F5F7FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C727F',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  tokenText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#333333',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  logoutBtn: {
    marginTop: 10,
    backgroundColor: '#FF3B30',
  },
});