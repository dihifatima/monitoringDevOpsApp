// src/hooks/home/useHomeState.ts
import type { ChecklistStep } from '@/src/components/features/home/OnboardingChecklist';

export type HomeState = 'loading' | 'new' | 'active';

// Client actif = au moins 1 dépôt suivi (cela implique que GitHub est connecté).
// Jenkins est optionnel : il ne bloque jamais l'état « actif ».
export function getHomeState(input: { loading: boolean; reposCount: number }): HomeState {
  if (input.loading) return 'loading';
  return input.reposCount > 0 ? 'active' : 'new';
}

// Lecture défensive du statut d'un connecteur.
// À VÉRIFIER avec le type ConnectorsStatusMap (connectorsService.ts) si l'étape 1 ne se coche pas.
export function isConnected(connectors: unknown, provider: string): boolean {
  const c = (connectors as Record<string, any> | undefined)?.[provider];
  return c?.status === 'CONNECTED';
}

type StepsInput = {
  githubConnected: boolean;
  reposCount: number;
  jenkinsLinked: boolean;
  onConnectGithub: () => void;
  onTrackRepo: () => void;
  onLinkJenkins: () => void;
};

export function buildSteps(i: StepsInput): ChecklistStep[] {
  return [
    {
      id: 'github',
      title: 'Connecter GitHub',
      why: 'Pour être alerté à chaque commit.',
      done: i.githubConnected,
      actionLabel: 'Connecter',
      onPress: i.onConnectGithub,
    },
    {
      id: 'repo',
      title: 'Suivre un dépôt',
      why: 'Choisissez le projet à surveiller.',
      done: i.reposCount > 0,
      actionLabel: 'Choisir',
      onPress: i.onTrackRepo,
    },
    {
      id: 'jenkins',
      title: 'Lier Jenkins',
      why: "Pour voir l'état de vos builds.",
      done: i.jenkinsLinked,
      optional: true,
      actionLabel: 'Lier',
      onPress: i.onLinkJenkins,
    },
  ];
}
