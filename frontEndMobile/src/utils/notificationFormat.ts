import { Notification } from '@/src/services/notificationsService';

export function getNotificationTitle(notification: Notification): string {
  switch (notification.type) {
    case 'COMMIT':
      return `Nouveau commit sur ${notification.trackedRepo?.name ?? ''}`;
    case 'JENKINS_BUILD':
      return 'Build Jenkins';
    case 'SONAR_ANALYSIS':
      return 'Analyse SonarQube terminée';
    default:
      return notification.type;
  }
}

export function formatRelativeTime(isoDate: string): string {
  const diffSec = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHour < 24) return `il y a ${diffHour}h`;
  if (diffDay < 7) return `il y a ${diffDay}j`;
  return new Date(isoDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}