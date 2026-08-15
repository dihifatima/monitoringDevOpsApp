import { useEffect, useState } from 'react';
import { getBuildDetail, type JenkinsBuildResponse } from '@/src/services/jenkinsService';

export function useBuildDetail(repoId: number | undefined, buildNumber: number | undefined) {
  const [build, setBuild] = useState<JenkinsBuildResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoId || buildNumber === undefined) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getBuildDetail(repoId, buildNumber)
      .then((data) => {
        if (!cancelled) setBuild(data);
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de récupérer le détail de ce build.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repoId, buildNumber]);

  return { build, isLoading, error };
}