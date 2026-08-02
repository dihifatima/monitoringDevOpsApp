// src/hooks/useGithubConnection.ts
import { useCallback, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { getGithubAuthorizationUrl } from '@/src/services/connectorsService';
import { useConnectors } from '@/src/context/ConnectorsContext';

const GITHUB_RETURN_URL = 'monitoringdevopsapp://github-connected';

function getQueryParam(url: string, key: string): string | null {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function useGithubConnection() {
  const { refresh } = useConnectors();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Retourne true si la connexion a réussi, false sinon (échec, ou annulation
   * par l'utilisateur) — permet à l'appelant de décider s'il navigue ensuite.
   */
  const connect = useCallback(async (): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);

    try {
      const authorizationUrl = await getGithubAuthorizationUrl();
      const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, GITHUB_RETURN_URL);

      if (result.type === 'success') {
        const status = getQueryParam(result.url, 'status');
        if (status === 'success') {
          await refresh();
          return true;
        }
        setError('La connexion à GitHub a échoué. Réessaie.');
        return false;
      }
      // 'cancel' / 'dismiss' → l'utilisateur a fermé le navigateur lui-même.
      return false;
    } catch {
      setError('Impossible de contacter le serveur. Vérifie ta connexion.');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [refresh]);

  return { connect, isConnecting, error };
}