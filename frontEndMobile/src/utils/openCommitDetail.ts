import { router } from 'expo-router';

let lastOpen: { key: string; timestamp: number } | null = null;

function isDuplicate(key: string): boolean {
  const now = Date.now();
  if (lastOpen?.key === key && now - lastOpen.timestamp < 1000) return true;
  lastOpen = { key, timestamp: now };
  return false;
}

// Délai pour laisser la première navigation (construction de la pile)
// se terminer avant d'ajouter l'écran de détail.
const STACK_DELAY_MS = 100;

/**
 * Ouvre le détail d'un commit depuis l'extérieur de l'onglet Projets
 * (Accueil, notifications, push).
 * Pile attendue : index (liste) -> [id] -> commit-detail.
 */
export function openCommitDetailFromOutside(repoId: number | string, sha: string) {
  const id = String(repoId);
  const trimmedSha = sha?.trim();
  if (!id || !trimmedSha) return;
  if (isDuplicate(`commit:${id}:${trimmedSha}`)) return;

  router.navigate(
    { pathname: '/(tabs)/Projets/[id]', params: { id } },
    { withAnchor: true },
  );

  setTimeout(() => {
    router.push({
      pathname: '/(tabs)/Projets/commit-detail',
      params: { repoId: id, sha: trimmedSha },
    });
  }, STACK_DELAY_MS);
}

/**
 * Ouvre le détail d'un build Jenkins depuis l'extérieur de l'onglet Pipelines.
 * Pile attendue : index (liste) -> [repoId] -> [buildNumber].
 */
export function openPipelineBuildFromOutside(repoId: number | string, buildNumber: number | string) {
  const id = String(repoId);
  const num = String(buildNumber);
  if (!id || !num) return;
  if (isDuplicate(`pipeline:${id}:${num}`)) return;

  router.navigate(
    { pathname: '/(tabs)/Pipelines/[repoId]', params: { repoId: id } },
    { withAnchor: true },
  );

  setTimeout(() => {
    router.push({
      pathname: '/(tabs)/Pipelines/[repoId]/[buildNumber]',
      params: { repoId: id, buildNumber: num },
    });
  }, STACK_DELAY_MS);
}