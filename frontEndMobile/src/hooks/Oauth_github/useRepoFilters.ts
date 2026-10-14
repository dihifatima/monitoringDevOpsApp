// src/hooks/Oauth_github/useRepoFilters.ts
import { useCallback, useMemo, useState } from 'react';
import type { RepoSummary } from '@/src/services/githubReposService';

export type StatusFilter = 'all' | 'tracked' | 'untracked';
export type SortKey = 'tracked' | 'az' | 'za';

export const OTHER_LANGUAGE = 'Autre';

export const SORT_LABELS: Record<SortKey, string> = {
  tracked: 'Suivis d’abord',
  az: 'Nom A → Z',
  za: 'Nom Z → A',
};

const langOf = (r: RepoSummary) => r.language ?? OTHER_LANGUAGE;

type Criteria = { query: string; status: StatusFilter; languages: string[] };

function matches(r: RepoSummary, c: Criteria, trackedIds: Map<number, number>) {
  const isTracked = trackedIds.has(r.externalId);
  if (c.status === 'tracked' && !isTracked) return false;
  if (c.status === 'untracked' && isTracked) return false;
  if (c.languages.length > 0 && !c.languages.includes(langOf(r))) return false;
  const q = c.query.trim().toLowerCase();
  if (q && !`${r.name} ${r.description ?? ''}`.toLowerCase().includes(q)) return false;
  return true;
}

export function useRepoFilters(repos: RepoSummary[], trackedIds: Map<number, number>) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [languages, setLanguages] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('tracked');

  const counts = useMemo(() => {
    const tracked = repos.filter((r) => trackedIds.has(r.externalId)).length;
    return { all: repos.length, tracked, untracked: repos.length - tracked };
  }, [repos, trackedIds]);

  // [{ key: 'Java', label: 'Java', count: 2 }, ..., 'Autre' en dernier]
  const languageOptions = useMemo(() => {
    const m = new Map<string, number>();
    repos.forEach((r) => m.set(langOf(r), (m.get(langOf(r)) ?? 0) + 1));
    return Array.from(m.entries())
      .sort(([a], [b]) =>
        a === OTHER_LANGUAGE ? 1 : b === OTHER_LANGUAGE ? -1 : a.localeCompare(b)
      )
      .map(([key, count]) => ({ key, label: key, count }));
  }, [repos]);

  const filtered = useMemo(() => {
    const list = repos.filter((r) => matches(r, { query, status, languages }, trackedIds));
    return list.sort((a, b) => {
      if (sort === 'tracked') {
        const ta = trackedIds.has(a.externalId);
        const tb = trackedIds.has(b.externalId);
        if (ta !== tb) return ta ? -1 : 1;
      }
      const c = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      return sort === 'za' ? -c : c;
    });
  }, [repos, trackedIds, query, status, languages, sort]);

  // Pour le bouton « Afficher N dépôts » du sheet Langage (sélection temporaire)
  const countWith = useCallback(
    (langs: string[]) =>
      repos.filter((r) => matches(r, { query, status, languages: langs }, trackedIds)).length,
    [repos, trackedIds, query, status]
  );

  const hasFilters = status !== 'all' || languages.length > 0 || query.trim() !== '';
  const reset = useCallback(() => {
    setQuery('');
    setStatus('all');
    setLanguages([]);
  }, []);

  return {
    query, setQuery,
    status, setStatus,
    languages, setLanguages,
    sort, setSort,
    counts, languageOptions, filtered, countWith, hasFilters, reset,
  };
}