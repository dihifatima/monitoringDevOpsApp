// src/hooks/useConnectors.ts
import { useCallback, useEffect, useState } from 'react';
import {
  getConnectorsStatus,
  type ConnectorsStatusMap,
} from '@/src/services/connectorsService';

export function useConnectors() {
  const [connectors, setConnectors] = useState<ConnectorsStatusMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getConnectorsStatus();
      setConnectors(data);
    } catch {
      setError('Impossible de récupérer le statut des connecteurs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { connectors, isLoading, error, refresh };
}