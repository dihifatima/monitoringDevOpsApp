import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { useState } from 'react';

function formatLockedMessage(retryAfterSeconds: number): string {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  if (minutes <= 1) {
    return 'Compte verrouillé suite à plusieurs tentatives échouées. Réessayez dans moins d’une minute.';
  }
  return `Compte verrouillé suite à plusieurs tentatives échouées. Réessayez dans ${minutes} minutes.`;
}

function getApiErrorMessage(error: any, fallback: string): string {
  const data = error.response?.data;
  if (!data) return fallback;

  if (data.businessErrorCode === 302 && data.retryAfterSeconds != null) {
    return formatLockedMessage(data.retryAfterSeconds);
  }
  if (Array.isArray(data.validationErrors) && data.validationErrors.length > 0) {
    return data.validationErrors[0];
  }
  return data.error || data.businessErrorDescription || fallback;
}

export function useGoogleSignIn() {
  const { googleLogin } = useAuthGlobal();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setApiError(null);
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const idToken = response.data.idToken;
        if (idToken) {
          await googleLogin(idToken);
        }
      }
    } catch (error: any) {
      // IMPORTANT : tester en premier si c'est une erreur backend (Axios).
      // isErrorWithCode() du SDK Google renvoie aussi true pour une AxiosError
      // (qui a également un champ .code, ex: "ERR_BAD_REQUEST"), donc l'ordre compte.
      if (error?.response || error?.isAxiosError) {
        setApiError(getApiErrorMessage(error, 'Impossible de se connecter avec Google.'));
      } else if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            break;
          case statusCodes.IN_PROGRESS:
            setApiError('Une connexion Google est déjà en cours.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setApiError('Google Play Services n’est pas disponible sur cet appareil.');
            break;
          default:
            setApiError('Une erreur est survenue avec la connexion Google.');
        }
      } else {
        setApiError('Une erreur inconnue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading, apiError };
}