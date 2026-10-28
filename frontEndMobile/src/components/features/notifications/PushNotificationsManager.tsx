import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { usePushNotifications } from '@/src/hooks/notifications/usePushNotifications';
import { registerPushToken } from '@/src/services/notificationsService';
import { useAuthGlobal } from '@/src/context/AuthContext';
import { resolveNotificationRoute } from '@/src/utils/resolveNotificationRoute';
import { useNotificationsGlobal } from '@/src/context/NotificationsContext';
import { openCommitDetailFromOutside } from '@/src/utils/openCommitDetail';
import { emitActivityRefresh } from '@/src/utils/activityEvents';

export function PushNotificationsManager() {
  const { user } = useAuthGlobal();
  const { expoPushToken } = usePushNotifications();
  const coldStartHandled = useRef(false);
  const { refreshUnreadCount } = useNotificationsGlobal();

  useEffect(() => {
    const receivedListener = Notifications.addNotificationReceivedListener(() => {
      refreshUnreadCount();
        emitActivityRefresh();

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

  // Tap sur la notification quand l'app est ouverte ou en arrière-plan
  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as any;
      const route = resolveNotificationRoute(data);
      if (route) {
        openCommitDetailFromOutside(route.repoId, route.sha);
      }
    });

    return () => responseListener.remove();
  }, []);

  // Tap sur la notification au démarrage à froid (app complètement fermée)
  useEffect(() => {
    if (!user || coldStartHandled.current) return;

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response || coldStartHandled.current) return;
      coldStartHandled.current = true;

      const data = response.notification.request.content.data as any;
      const route = resolveNotificationRoute(data);
      if (route) {
        openCommitDetailFromOutside(route.repoId, route.sha);
      }
    });
  }, [user]);

  return null;
}
