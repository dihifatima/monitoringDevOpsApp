import { useEffect, useState, useCallback } from 'react';
import { getBuildList, type JenkinsJobBuildsResponse } from '@/src/services/jenkinsService';

export function useBuildList(repoId: number | undefined) {
  const [builds, setBuilds] = useState<JenkinsJobBuildsResponse['builds']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuilds = useCallback(async () => {
    if (!repoId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBuildList(repoId);
      console.log('BUILD LIST RAW:', JSON.stringify(data.builds[0], null, 2));

      setBuilds(data.builds ?? []);
    } catch {
      setError("Impossible de récupérer l'historique des builds.");
    } finally {
      setIsLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);

  return { builds, isLoading, error, refetch: fetchBuilds };
}