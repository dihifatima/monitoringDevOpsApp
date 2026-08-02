// src/hooks/Oauth_sonarqube/useSonarMeasures.ts
import { useCallback, useEffect, useState } from 'react';
import { getSonarMeasures, type SonarQubeMeasuresResponse } from '@/src/services/sonarQubeService';

export function useSonarMeasures(repoId: number, sonarProjectKey: string | null) {
  const [measures, setMeasures] = useState<SonarQubeMeasuresResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    // Ne rien faire si le repo n'est pas encore lié à un projet Sonar
    if (!sonarProjectKey) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getSonarMeasures(repoId);
      setMeasures(data);
    } catch {
      setError('Impossible de récupérer les métriques SonarQube.');
    } finally {
      setIsLoading(false);
    }
  }, [repoId, sonarProjectKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { measures, isLoading, error, refresh };
}