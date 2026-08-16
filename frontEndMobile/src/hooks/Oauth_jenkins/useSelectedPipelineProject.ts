import { useState, useMemo } from 'react';
import { usePipelinesOverview, type PipelineEntry } from './usePipelinesOverview';

export function useSelectedPipelineProject() {
  const { entries, isLoading, refetch } = usePipelinesOverview();
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);

  const selected: PipelineEntry | null = useMemo(() => {
    if (entries.length === 0) return null;
    const found = entries.find((e) => e.repoId === selectedRepoId);
    return found ?? entries[0]; // par défaut, le premier repo suivi
  }, [entries, selectedRepoId]);

  return { entries, selected, selectRepo: setSelectedRepoId, isLoading, refetch };
}