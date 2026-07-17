import React, { createContext, useState, useEffect, useContext } from 'react';
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

  // Cas d'usage : reconnexion automatique au démarrage de l'application
  const checkSession = async () => {
    try {
          console.log("🔍 checkSession() appelée");

      const token = await TokenStorage.getToken();
      if (token) {
        // Au démarrage, on n'a que le token, donc l'appel /auth/me est indispensable
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    }  catch (error: any) {
  console.log("❌ checkSession ERREUR:", error?.response?.status, JSON.stringify(error?.response?.data));
  await TokenStorage.deleteToken();
  setUser(null);
}   finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Cas d'usage : Connexion manuelle (LOGIN)
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      console.log("👉 RÉPONSE EXACTE DU BACKEND :", JSON.stringify(data, null, 2));
      if (data && data.token) {
        // 1. On sauvegarde le token en tâche de fond
        await TokenStorage.saveToken(data.token);
        
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

  // --- RE-AJOUT DE LA FONCTION LOGOUT QUI MANQUAIT ---
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log("Erreur logout backend silencieuse");
    } finally {
      await TokenStorage.deleteToken();
      setUser(null);
      router.replace("/(auth)/login");
    }
  };
  const handleGoogleLogin = async (idToken: string) => {
  try {
    setLoading(true);
    const data = await authService.googleLogin(idToken);
    if (data && data.token) {
      await TokenStorage.saveToken(data.token);
      // La réponse Google du backend ne contient que le token (pas roles/fullName)
      // -> on appelle /auth/me pour récupérer le profil complet
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


  // --- RE-AJOUT DU RETURN DU PROVIDER ---
  return (
<AuthContext.Provider value={{ user, loading, login: handleLogin, googleLogin: handleGoogleLogin, logout: handleLogout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- RE-AJOUT DE L'EXPORT DU HOOK GLOBAL ---
export const useAuthGlobal = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthGlobal doit être encapsulé dans un AuthProvider");
  return context;
};