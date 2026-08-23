import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { usePushNotifications } from '@/src/hooks/notifications/usePushNotifications';
import { registerPushToken } from '@/src/services/notificationsService';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { resolveNotificationRoute } from '@/src/utils/resolveNotificationRoute';
import { useNotificationsGlobal } from '@/src/context/NotificationsContext';

export function PushNotificationsManager() {
  const { user } = useAuthGlobal();
  const { expoPushToken } = usePushNotifications();
  const coldStartHandled = useRef(false);
const { refreshUnreadCount } = useNotificationsGlobal();

useEffect(() => {
  const receivedListener = Notifications.addNotificationReceivedListener(() => {
    refreshUnreadCount();
  });
  return () => receivedListener.remove();
}, [refreshUnreadCount]); 
  useEffect(() => {
    if (user && expoPushToken) {
      registerPushToken(expoPushToken).catch((err) => {
        console.log('Erreur enregistrement push Token:', err);
      });
    }
  }, [user, expoPushToken]);

  useEffect(() => {
    if (!user || coldStartHandled.current) return;

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response || coldStartHandled.current) return;
      coldStartHandled.current = true;

      const data = response.notification.request.content.data as any;
      const route = resolveNotificationRoute(data);
      if (route) router.push(route as any);
    });
  }, [user]);

  return null;
}