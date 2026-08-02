// src/context/ConnectorsContext.tsx
import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  getConnectorsStatus,
  type ConnectorsStatusMap,
} from '@/src/services/connectorsService';

type ConnectorsContextValue = {
  connectors: ConnectorsStatusMap;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const ConnectorsContext = createContext<ConnectorsContextValue | undefined>(undefined);

export function ConnectorsProvider({ children }: { children: ReactNode }) {
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

  return (
    <ConnectorsContext.Provider value={{ connectors, isLoading, error, refresh }}>
      {children}
    </ConnectorsContext.Provider>
  );
}

export function useConnectors() {
  const context = useContext(ConnectorsContext);
  if (!context) {
    throw new Error('useConnectors must be used within a ConnectorsProvider');
  }
  return context;
}