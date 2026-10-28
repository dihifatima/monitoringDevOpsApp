import { useCallback, useMemo,useEffect } from 'react';
import { useTrackedRepos } from '@/src/hooks/Oauth_github/useTrackedRepos';
import { usePipelinesOverview } from '@/src/hooks/Oauth_jenkins/usePipelinesOverview';
import { useFocusEffect } from 'expo-router';
import { onActivityRefresh } from '@/src/utils/activityEvents';
export type ActivityItem = {
  repoId: number;
  repoName: string;
  commitSha: string | null;
  commitMessage: string | null;
  commitDate: string | null;
  buildResult: string | null;
  buildBuilding: boolean;
};

export function useRecentActivity() {
  const { repos, isLoading: reposLoading, refresh: refreshRepos } = useTrackedRepos();
  const { entries, isLoading: buildsLoading, refetch: refetchBuilds } = usePipelinesOverview();

  const activity = useMemo<ActivityItem[]>(() => {
    return repos
      .map((repo) => {
        const pipelineEntry = entries.find((e) => e.repoId === repo.id);
        return {
          repoId: repo.id,
          repoName: repo.name,
          commitSha: repo.lastCommitSha,
          commitMessage: repo.lastCommitMessage,
          commitDate: repo.lastCommitDate,
          buildResult: pipelineEntry?.build?.result ?? null,
          buildBuilding: pipelineEntry?.build?.building ?? false,
        };
      })
      .filter((item) => item.commitDate !== null)
      .sort((a, b) => new Date(b.commitDate!).getTime() - new Date(a.commitDate!).getTime())
      .slice(0, 5);
  }, [repos, entries]);

const refresh = useCallback(async () => {
    await Promise.all([refreshRepos(), refetchBuilds()]);
  }, [refreshRepos, refetchBuilds]);

  // 1. Recharger quand l'Accueil reprend le focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // 2. Recharger à la réception d'une notification (nouveau commit)
  useEffect(() => {
    const sub = onActivityRefresh(refresh);
    return () => sub.remove();
  }, [refresh]);


  return { activity, isLoading: reposLoading || buildsLoading, refresh };
}