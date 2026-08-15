import { useCallback, useState } from 'react';
import {connectJenkins,disconnectJenkins, type JenkinsConnectRequest,} from '@/src/services/connectorsService';
import { useConnectors } from '@/src/context/ConnectorsContext';

export function useJenkinsConnection() {
  const { refresh } = useConnectors();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Retourne true si la connexion a réussi, false sinon.
   */
  const connect = useCallback(async (request: JenkinsConnectRequest): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);

    try {
      await connectJenkins(request);
      await refresh();
      return true;
    } catch {
      setError('Impossible de se connecter à jenkins. Vérifie l\'URL et le token.');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [refresh]);

  /**
   * Retourne true si la déconnexion a réussi, false sinon.
   */
  const disconnect = useCallback(async (): Promise<boolean> => {
    setIsDisconnecting(true);
    setError(null);

    try {
      await disconnectJenkins();
      await refresh();
      return true;
    } catch {
      setError('Impossible de déconnecter jenkins.');
      return false;
    } finally {
      setIsDisconnecting(false);
    }
  }, [refresh]);

  return { connect, disconnect, isConnecting, isDisconnecting, error };
}