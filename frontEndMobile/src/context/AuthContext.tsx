import React, { createContext, useState, useEffect, useContext } from 'react';
import { DeviceEventEmitter, Alert } from 'react-native';
import { authService, UserResponse } from '@/src/services/authService';
import { TokenStorage } from '@/src/storage/TokenStorage';
import { router } from 'expo-router';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Cas d'usage : reconnexion automatique au démarrage de l'application.
  // On vérifie la présence du REFRESH token (pas l'access token) : même si
  // l'access token stocké est expiré ou absent, l'intercepteur Axios saura
  // le renouveler automatiquement dès le premier appel à getCurrentUser().
  const checkSession = async () => {
    try {
      const refreshToken = await TokenStorage.getRefreshToken();
      if (refreshToken) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error: any) {
      await TokenStorage.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    // Déconnexion forcée déclenchée par l'intercepteur Axios (axios.js) quand
    // le refresh token est invalide/expiré/révoqué - peut survenir à tout
    // moment pendant que l'utilisateur navigue dans l'app, pas seulement au démarrage.
    const subscription = DeviceEventEmitter.addListener('FORCE_LOGOUT', (payload?: { reason?: string }) => {
      setUser(null);

      const isTokenReuse = payload?.reason === 'token_reuse';
      Alert.alert(
        isTokenReuse ? "Activité suspecte détectée" : "Session expirée",
        isTokenReuse
          ? "Une tentative de connexion inhabituelle a été détectée sur votre compte. Par sécurité, vous avez été déconnecté de tous vos appareils. Veuillez vous reconnecter."
          : "Votre session a expiré. Veuillez vous reconnecter.",
        [
          {
            text: "Se reconnecter",
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
        { cancelable: false }
      );
    });

    return () => subscription.remove();
  }, []);

  // Cas d'usage : Connexion manuelle (LOGIN)
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      if (data && data.accessToken && data.refreshToken) {
        // 1. On sauvegarde les deux tokens en tâche de fond
        await TokenStorage.saveTokens(data.accessToken, data.refreshToken);

        // 2. PAS d'appel /auth/me ici !
        // On construit l'objet utilisateur directement avec ce que le login a renvoyé
        setUser({
          id: 0,
          email: email,
          fullName: data.fullName,
          roles: data.roles,
          profilePicture: null
        });

        // 3. Redirection instantanée vers l'écran d'accueil sans latence API !
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error("Erreur login :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = await TokenStorage.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      // Non bloquant : même si l'appel serveur échoue, on nettoie la session locale
    } finally {
      await TokenStorage.clearTokens();
      setUser(null);
      router.replace("/(auth)/login");
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    try {
      setLoading(true);
      const data = await authService.googleLogin(idToken);
      if (data && data.accessToken && data.refreshToken) {
        await TokenStorage.saveTokens(data.accessToken, data.refreshToken);
        // Le backend renvoie déjà roles/fullName pour Google aussi désormais,
        // mais on garde l'appel /auth/me pour récupérer le profil complet
        // (ex: profilePicture, non présent dans la réponse de login).
        const userData = await authService.getCurrentUser();
        setUser(userData);
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error("Erreur Google login :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, googleLogin: handleGoogleLogin, logout: handleLogout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthGlobal = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthGlobal doit être encapsulé dans un AuthProvider");
  return context;
};