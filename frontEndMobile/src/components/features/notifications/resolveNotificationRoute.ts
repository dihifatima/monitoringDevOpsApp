type NotificationData = {
  type?: string;
  trackedRepoId?: number | string;
  commitsha?: string;
};

export function resolveNotificationRoute(data: NotificationData | undefined) {
  if (!data?.type) return null;

  switch (data.type) {
    case 'COMMIT':
      return {
        pathname: '/(tabs)/Projets/commit-detail' as const,
        params: { repoId: String(data.trackedRepoId), commitsha: String(data.commitsha ?? '') },
      };

    // Pas encore d'écran/ID dédié pour ces types → fallback générique vers le repo
    case 'JENKINS_BUILD':
    case 'SONAR_ANALYSIS':
    default:
      return null; // à remplacer une fois l'écran repo générique confirmé
  }
}