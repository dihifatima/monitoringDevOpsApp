import { useEffect, useState, useCallback } from 'react';
import { getLastBuild, type JenkinsBuildResponse } from '@/src/services/jenkinsService';
import { useTrackedRepos } from '@/src/hooks/Oauth_github/useTrackedRepos';

export type PipelineEntry = {
  repoId: number;
  repoName: string;
  fullName: string;
  jenkinsJobName: string | null;
  build: JenkinsBuildResponse | null;
  buildError: boolean;
};

export function usePipelinesOverview() {
  const { repos, isLoading: reposLoading, refresh: refreshRepos } = useTrackedRepos(); // ✅ refresh, pas refetch

  const [entries, setEntries] = useState<PipelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!repos || repos.length === 0) {
      setEntries([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const results = await Promise.all(
      repos.map(async (repo): Promise<PipelineEntry> => {
        const base = {
          repoId: repo.id,
          repoName: repo.fullName.split('/')[1] ?? repo.fullName,
          fullName: repo.fullName,
          jenkinsJobName: repo.jenkinsJobName ?? null,
        };

        if (!repo.jenkinsJobName) {
          return { ...base, build: null, buildError: false };
        }

        try {
          const build = await getLastBuild(repo.id);
          return { ...base, build, buildError: false };
        } catch {
          return { ...base, build: null, buildError: true };
        }
      })
    );

    setEntries(results);
    setIsLoading(false);
  }, [repos]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refetch = useCallback(async () => {
    await refreshRepos(); // recharge la liste des repos → repos change → fetchAll se relance via le useEffect
  }, [refreshRepos]);

  return { entries, isLoading: reposLoading || isLoading, refetch };
}