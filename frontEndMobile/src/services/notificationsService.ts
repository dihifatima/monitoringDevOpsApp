import API from '@/src/config/axios';

export type NotificationType = 'COMMIT'; // ajoute les autres valeurs de l'enum Java NotificationType si besoin

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  commitsha: string | null;
  read: boolean;
  createdAt: string; // ISO string, à parser côté UI (ex: avec date-fns) pour l'affichage relatif
  trackedRepo: {
    id: number;
    name: string;
    fullName?: string;
  };
}

export async function registerPushToken(expoPushToken: string): Promise<void> {
  await API.post('/api/notifications/push-token', { expoPushToken });
}

export async function getNotifications(): Promise<Notification[]> {
  const response = await API.get<Notification[]>('/api/notifications');
  return response.data;
}

/**
 * Attention : malgré son nom, l'endpoint backend renvoie la LISTE des
 * notifications non lues, pas un compteur. On la garde telle quelle ici
 * (utile pour afficher un aperçu), et on dérive le compte avec .length
 * côté hook si on veut juste un nombre pour le badge.
 */
export async function getUnreadNotifications(): Promise<Notification[]> {
  const response = await API.get<Notification[]>('/api/notifications/unread-count');
  return response.data;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await API.patch(`/api/notifications/${id}/read`);
}