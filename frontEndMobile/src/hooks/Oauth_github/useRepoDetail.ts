// src/hooks/useRepoDetail.ts
import { useRepoCommits } from '@/src/hooks/Oauth_github/useRepoCommits';
import { useTrackedRepos } from '@/src/hooks/Oauth_github/useTrackedRepos';
import { useMemo } from 'react';

/**
 * Combine useTrackedRepos (liste des projets suivis) et useRepoCommits
 * (commits d'un repo donné) pour l'écran de détail [id].tsx.
 * - `id` vient de useLocalSearchParams et est toujours une string,
 *   d'où le String(repo.id) pour la comparaison.
 * - owner/repo sont extraits de fullName ("owner/repo"), car
 *   TrackedRepoResponse ne les stocke pas séparément.
 */
export function useRepoDetail(id?: string) {
  const {
    repos: trackedRepos,
    isLoading: trackedLoading,
    error: trackedError,
    refresh: refreshTracked,
  } = useTrackedRepos();

  const selectedRepo = useMemo(
    () => trackedRepos.find((repo) => String(repo.id) === id),
    [trackedRepos, id]
  );

  const [owner, repoName] = useMemo(() => {
    if (!selectedRepo?.fullName) return [undefined, undefined] as const;
    const parts = selectedRepo.fullName.split('/');
    return parts.length === 2 ? (parts as [string, string]) : ([undefined, undefined] as const);
  }, [selectedRepo]);

  const {
    commits,
    isLoading: commitsLoading,
    error: commitsError,
    refresh: refreshCommits,
  } = useRepoCommits(owner, repoName);

  return {
    isLoading: trackedLoading,
    error: trackedError,
    selectedRepo,
    commits,
    commitsLoading,
    commitsError,
    refresh: refreshTracked,
    refreshCommits,
  };
}