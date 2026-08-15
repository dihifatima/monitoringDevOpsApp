import { useEffect, useState } from 'react';
import { getBuildForCommit } from '@/src/services/jenkinsService';
import type { JenkinsBuildResponse } from '@/src/services/jenkinsService';

export function useCommitBuild(repoId: number | undefined, sha: string | undefined) {
  const [build, setBuild] = useState<JenkinsBuildResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoId || !sha) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getBuildForCommit(repoId, sha)
      .then((result) => {
        if (!cancelled) setBuild(result);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de récupérer le build Jenkins.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repoId, sha]);

  return { build, isLoading, error };
}