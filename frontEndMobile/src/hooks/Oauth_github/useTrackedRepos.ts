// src/hooks/useTrackedRepos.ts
import { useCallback, useEffect, useState } from 'react';
import {
  getTrackedGithubRepos,
  type TrackedRepoResponse,
} from '@/src/services/githubReposService';

export function useTrackedRepos() {
  const [repos, setRepos] = useState<TrackedRepoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTrackedGithubRepos();
      setRepos(data);
    } catch {
      setError('Impossible de récupérer les projets suivis.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { repos, isLoading, error, refresh };
}