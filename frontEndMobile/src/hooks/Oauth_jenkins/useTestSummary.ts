import { useEffect, useState } from 'react';
import { getTestSummary, type TestSummaryResponse } from '@/src/services/jenkinsService';

export function useTestSummary(repoId: number | undefined, buildNumber: number | undefined) {
  const [summary, setSummary] = useState<TestSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!repoId || buildNumber === undefined) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);

    getTestSummary(repoId, buildNumber)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repoId, buildNumber]);

  return { summary, isLoading };
}