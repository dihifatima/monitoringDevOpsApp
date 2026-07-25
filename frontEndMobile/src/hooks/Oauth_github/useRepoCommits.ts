// src/hooks/useRepoCommits.ts
import { useCallback, useEffect, useState } from 'react';
import { getRepoCommits, type CommitSummary } from '@/src/services/githubReposService';

export function useRepoCommits(owner?: string, repo?: string) {
  const [commits, setCommits] = useState<CommitSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!owner || !repo) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRepoCommits(owner, repo);
      setCommits(data);
    } catch {
      setError('Impossible de récupérer les commits.');
    } finally {
      setIsLoading(false);
    }
  }, [owner, repo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { commits, isLoading, error, refresh };
}