// src/hooks/notifications/useNotifications.ts
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  getNotifications,
  markNotificationAsRead,
  Notification,
} from '@/src/services/notificationsService';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refetch à chaque fois que l'écran reprend le focus (retour depuis un autre écran)
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  // Mise à jour optimiste locale : évite un refetch complet juste pour un "lu"
  const markAsRead = useCallback(async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await markNotificationAsRead(id);
    } catch (err) {
      // rollback si l'appel échoue
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    }
  }, []);

  return { notifications, loading, refreshing, error, onRefresh, markAsRead };
}