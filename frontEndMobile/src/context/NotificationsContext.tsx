import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { getUnreadNotifications } from '@/src/services/notificationsService';
import { useAuthGlobal } from '@/src/context/AuthContext';

interface NotificationsContextType {
  unreadCount: number;
  refreshUnreadCount: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthGlobal();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const unread = await getUnreadNotifications();
      setUnreadCount(unread.length);
    } catch {
      // silencieux, on garde l'ancienne valeur en cas d'erreur réseau ponctuelle
    }
  }, [user]);

  // Rafraîchit dès qu'on est connecté
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  // Rafraîchit quand l'app revient au premier plan (cas : notif reçue app fermée/arrière-plan)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshUnreadCount();
    });
    return () => subscription.remove();
  }, [refreshUnreadCount]);

  return (
    <NotificationsContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsGlobal = () => {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotificationsGlobal doit être encapsulé dans un NotificationsProvider');
  return context;
};