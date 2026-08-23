// src/hooks/notifications/useUnreadNotificationsCount.ts
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getUnreadNotifications } from '@/src/services/notificationsService';

export function useUnreadNotificationsCount() {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const unread = await getUnreadNotifications();
      setCount(unread.length);
    } catch {
      // silencieux : le badge n'affiche juste rien de nouveau en cas d'erreur réseau ponctuelle
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCount();
    }, [fetchCount])
  );

  return count;
}