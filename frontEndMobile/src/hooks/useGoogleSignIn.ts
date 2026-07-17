import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { useState } from 'react';

export function useGoogleSignIn() {
  const { googleLogin } = useAuthGlobal();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    console.log("🟢 signInWithGoogle appelée");
    try {
      setLoading(true);
      console.log("🟢 Vérification Play Services...");
      await GoogleSignin.hasPlayServices();
      console.log("🟢 Play Services OK, ouverture du sign-in...");
      const response = await GoogleSignin.signIn();
      console.log("🟢 Réponse Google:", JSON.stringify(response));

      if (isSuccessResponse(response)) {
        const idToken = response.data.idToken;
        console.log("🟢 idToken reçu:", idToken ? "oui" : "non");
        if (idToken) {
          await googleLogin(idToken);
        }
      }
    } catch (error) {
      console.log("🔴 ERREUR:", JSON.stringify(error));
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('Connexion Google annulée par l’utilisateur');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Connexion Google déjà en cours');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.error('Google Play Services non disponible');
            break;
          default:
            console.error('Erreur Google Sign-In :', error);
        }
      } else {
        console.error('Erreur inconnue Google Sign-In :', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
}