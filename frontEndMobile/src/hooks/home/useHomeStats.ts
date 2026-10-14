import { useMemo } from 'react';
import { usePipelinesOverview } from '@/src/hooks/Oauth_jenkins/usePipelinesOverview';

export function useHomeStats() {
const { entries, isLoading, refetch } = usePipelinesOverview();
  const stats = useMemo(() => {
    const linked = entries.filter((e) => e.jenkinsJobName);
    const success = linked.filter((e) => e.build?.result === 'SUCCESS').length;
    const failure = linked.filter((e) => e.build?.result === 'FAILURE').length;
    const building = linked.filter((e) => e.build?.building).length;

    return {
      totalRepos: entries.length,
      linkedCount: linked.length, // NOUVEAU : nombre de repos avec un job Jenkins lié
      success,
      failure,
      building,
    };
  }, [entries]);

return { stats, isLoading, refresh: refetch };
}