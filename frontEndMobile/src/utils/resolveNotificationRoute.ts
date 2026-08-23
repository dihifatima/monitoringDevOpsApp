// src/utils/notifications/resolveNotificationRoute.ts
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
        params: {
          repoId: String(data.trackedRepoId),
          sha: String(data.commitsha ?? ''), // ⚠️ le nom du param attendu par l'écran est "sha", pas "commitsha"
        },
      };

    case 'JENKINS_BUILD':
    case 'SONAR_ANALYSIS':
    default:
      return null;
  }
}