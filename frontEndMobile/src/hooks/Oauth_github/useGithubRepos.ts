// src/hooks/useGithubRepos.ts
import { useCallback, useEffect, useState } from 'react';
import {
  getGithubRepos,
  getTrackedGithubRepos,
  trackGithubRepo,
  type RepoSummary,
} from '@/src/services/githubReposService';

export function useGithubRepos() {
  const [repos, setRepos] = useState<RepoSummary[]>([]);
  const [trackedIds, setTrackedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allRepos, tracked] = await Promise.all([
        getGithubRepos(),
        getTrackedGithubRepos(),
      ]);
      setRepos(allRepos);
      setTrackedIds(new Set(tracked.map((t) => t.externalRepoId)));
    } catch {
      setError('Impossible de charger tes repos GitHub.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const track = useCallback(async (repo: RepoSummary) => {
    setTrackingId(repo.externalId);
    try {
      await trackGithubRepo({
        externalRepoId: repo.externalId,
        name: repo.name,
        fullName: repo.fullName,
        url: repo.url,
      });
      setTrackedIds((prev) => new Set(prev).add(repo.externalId));
    } catch {
      setError(`Impossible de suivre ${repo.name}. Réessaie.`);
    } finally {
      setTrackingId(null);
    }
  }, []);

  return { repos, trackedIds, isLoading, trackingId, error, track, refresh: load };
}