import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  QUICK_ACTIONS_CATALOG,
  DEFAULT_QUICK_ACTIONS,
  type QuickActionKey,
} from '@/src/constants/quickActions';

const STORAGE_KEY = 'quick_actions_selected';

export function useQuickActionsPrefs() {
  const [selected, setSelected] = useState<QuickActionKey[]>(DEFAULT_QUICK_ACTIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((raw) => {
        if (raw) setSelected(JSON.parse(raw));
      })
      .catch(() => {
        // pas de préférence sauvegardée encore, on garde le défaut
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggle = useCallback((key: QuickActionKey) => {
    setSelected((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const selectedActions = QUICK_ACTIONS_CATALOG.filter((a) => selected.includes(a.key));

  return { selected, selectedActions, toggle, isLoading };
}