// src/hooks/Oauth_sonarqube/useCommitMeasures.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCommitMeasures,
  type CommitMeasures,
} from '@/src/services/sonarQubeService';

export function useCommitMeasures(repoId: number, sonarProjectKey: string | null) {
  const [analyses, setAnalyses] = useState<CommitMeasures[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sonarProjectKey) {
      setAnalyses([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getCommitMeasures(repoId);
      setAnalyses(data);
    } catch {
      setError('Impossible de récupérer les métriques par commit.');
    } finally {
      setIsLoading(false);
    }
  }, [repoId, sonarProjectKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Garde l'analyse complète (date, projectVersion, measures), pas juste les measures
  const analysisByRevision = useMemo(() => {
    const map = new Map<string, CommitMeasures>();
    for (const analysis of analyses) {
      map.set(analysis.revision, analysis);
    }
    return map;
  }, [analyses]);

  return { analysisByRevision, isLoading, error, refresh };
}