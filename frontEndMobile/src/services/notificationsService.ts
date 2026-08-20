import API from '@/src/config/axios';

export async function registerPushToken(expoPushToken: string): Promise<void> {
  await API.post('/api/notifications/push-token', { expoPushToken });
}