import { useEffect } from 'react';
import { usePushNotifications } from '@/src/hooks/notifications/usePushNotifications';
import { registerPushToken } from '@/src/services/notificationsService';
import { useAuthGlobal } from '@/src/context/AuthContext';

export function PushNotificationsManager() {
  const { user } = useAuthGlobal();
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    if (user && expoPushToken) {
      registerPushToken(expoPushToken).catch((err) => {
        console.log('Erreur enregistrement push token:', err);
      });
    }
  }, [user, expoPushToken]);

  return null;
}