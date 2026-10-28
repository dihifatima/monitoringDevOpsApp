// src/utils/resolveNotificationRoute.ts
type NotificationData = {
  type?: string;
  trackedRepoId?: number | string;
  commitsha?: string;
};

export function resolveNotificationRoute(data: NotificationData | undefined): { repoId: string; sha: string } | null {
  if (data?.type !== 'COMMIT' || data.trackedRepoId == null || !data.commitsha?.trim()) {
    return null;
  }

  return {
    repoId: String(data.trackedRepoId),
    sha: data.commitsha.trim(),
  };
}
