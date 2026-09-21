// src/hooks/Oauth_github/useGithubRepos.ts
import { useCallback, useEffect, useState } from 'react';
import {
  getGithubRepos,
  getTrackedGithubRepos,
  trackGithubRepo,
  untrackGithubRepo,
  type RepoSummary,
  type TrackedRepoResponse,
} from '@/src/services/githubReposService';

// externalRepoId (id GitHub) -> id du suivi en base (utilisé pour la suppression)
const toIdMap = (tracked: TrackedRepoResponse[]) =>
  new Map<number, number>(tracked.map((t) => [t.externalRepoId, t.id]));

export function useGithubRepos() {
  const [repos, setRepos] = useState<RepoSummary[]>([]);
  const [trackedIds, setTrackedIds] = useState<Map<number, number>>(new Map());
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
      setTrackedIds(toIdMap(tracked));
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
    setError(null);
    try {
      const updated = await trackGithubRepo({
        externalRepoId: repo.externalId,
        name: repo.name,
        fullName: repo.fullName,
        url: repo.url,
      });
      setTrackedIds(toIdMap(updated));
    } catch {
      setError(`Impossible de suivre ${repo.name}. Réessaie.`);
    } finally {
      setTrackingId(null);
    }
  }, []);

  const untrack = useCallback(
    async (repo: RepoSummary) => {
      const trackedRepoId = trackedIds.get(repo.externalId);
      if (trackedRepoId === undefined) return;

      setTrackingId(repo.externalId);
      setError(null);
      try {
        const updated = await untrackGithubRepo(trackedRepoId);
        setTrackedIds(toIdMap(updated));
      } catch {
        setError(`Impossible d'arrêter le suivi de ${repo.name}. Réessaie.`);
      } finally {
        setTrackingId(null);
      }
    },
    [trackedIds]
  );

  return {
    repos,
    trackedIds,
    isLoading,
    trackingId,
    error,
    track,
    untrack,
    refresh: load,
  };
}