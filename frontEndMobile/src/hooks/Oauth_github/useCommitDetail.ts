// src/hooks/Oauth_github/useCommitDetail.ts
import { useCallback, useEffect, useState } from 'react';
import { getCommitDetail, CommitDetailResponse } from '@/src/services/githubReposService';

export function useCommitDetail(owner?: string, repo?: string, sha?: string) {
  const [commitDetail, setCommitDetail] = useState<CommitDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!owner || !repo || !sha) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getCommitDetail(owner, repo, sha);
      setCommitDetail(data);
    } catch (err) {
      console.error('Erreur chargement détail commit:', err);
      setError('Impossible de charger le détail du commit.');
    } finally {
      setIsLoading(false);
    }
  }, [owner, repo, sha]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    commitDetail,
    isLoading,
    error,
    refresh: fetchDetail,
  };
}